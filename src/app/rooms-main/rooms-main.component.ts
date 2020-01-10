import { Component, OnInit, OnDestroy } from "@angular/core";
import { RoomService } from "../rooms/service/room.service";
import { LoginService } from "../login/service/login.service";
import { User } from "../model/User";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Proposal } from "../model/lunch/Proposal";
import { LunchWsService } from './service/lunch-ws.service';
import { LotteryResults } from '../model/LotteryResults';
import { Room } from '../model/Room';
import { RoomUser } from '../model/RoomUser';
import { TimeService } from '../time.service';
import { ProposalResponse } from '../model/lunch/ProposalResponse';

@Component({
  selector: "app-rooms-main",
  templateUrl: "./rooms-main.component.html",
  styleUrls: ["./rooms-main.component.css"]
})
export class RoomsMainComponent implements OnInit, OnDestroy {
  public roomDetail: Room;
  public currentUser: User;
  public phase = 0; // 0 - sign phase; 1 - post phase; 2 - vote phase; 3 - end
  roomUsers: RoomUser[] = [];
  subscriptions: Subscription[] = [];
  timeCheckingSubscription: Subscription;
  proposalUpdateCheckerIntervalId;
  proposals: Map<string, Proposal> = new Map();
  summary = false;
  winner: string;
  proposalWin: Proposal;
  ended = false;
  public currentTime = new Date().getTime();
  public startTime = new Date().getTime();
  public signProgress = 0;
  public postProgress = 0;
  public voteProgress = 0;

  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router,
    private lunchWsService: LunchWsService,
    private timeService: TimeService
  ) { }

  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    const roomId = this.cookieService.get("room");
    if (roomId.length < 1) {
      this.router.navigateByUrl("rooms");
    } else {
      this.subscriptions.push(
        this.roomService.joinRoomById(roomId).subscribe({
          next: response => {
            this.roomDetail = response;
            if (!this.timeCheckingSubscription) {
              this.timeCheckingSubscription = this.timeService.timeEvent.subscribe({
                next: (time: Date) => {
                  this.phaseChecker(time);
                }
              });
            }
            this.subscriptions.push(this.lunchWsService.newMessageEvent.subscribe({
              next: (updatedProposals: ProposalResponse) => {
                if (updatedProposals) {
                  updatedProposals.proposals.forEach(proposal => {
                    this.proposals.set(proposal.proposalId, proposal);
                  });
                  if (updatedProposals.total < this.proposals.size) {
                    this.proposals.forEach(proposal => {
                      if (!updatedProposals.proposals.includes(proposal)) {
                        this.proposals.delete(proposal.proposalId);
                      }
                    });
                  }
                }
              },
              error: err => {
                console.log(err);
              },
              complete: () => {
                console.log('completed');
              }
            }));
            this.subscriptions.push(this.lunchWsService.errorMessageEvent.subscribe({
              next: (err: string) => {
                alert(err);
              }
            }));
            this.subscriptions.push(this.lunchWsService.lotteryResultsEvent.subscribe({
              next: (results: LotteryResults) => {
                this.winner = results.userNick;
                this.proposalWin = this.proposals.get(results.winnerProposalId);
                this.summary = true;
                this.clearCheckers();
                this.voteProgress = 100;
                this.signProgress = 100;
                this.postProgress = 100;
              }
            }));
            this.subscriptions.push(this.lunchWsService.usersEvent.subscribe({
              next: (rUsers: RoomUser[]) => {
                this.roomUsers = rUsers;
              }
            }));
          },
          error: err => {
            console.log(err);
            this.router.navigateByUrl("rooms");
          },
          complete: () => {
            this.connectWs();
            console.log("completed");
          }
        })
      );
    };

  }

  private connectWs() {
    this.lunchWsService.connect();
    this.lunchWsService.findAllProposals();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.lunchWsService.disconnect();
    this.clearCheckers();
  }

  private clearCheckers() {
    window.clearInterval(this.proposalUpdateCheckerIntervalId);
    if (this.timeCheckingSubscription) {
      this.timeCheckingSubscription.unsubscribe();
    }
  }

  phaseChecker(time: Date) {
    this.currentTime = time.getTime();
    if (this.currentTime > this.roomDetail.signDeadline) {
      if (this.currentTime <= this.roomDetail.postDeadline) {
        this.phase = 1;
        this.signProgress = 100;
        this.postProgress = ((this.currentTime - this.roomDetail.signDeadline) / (this.roomDetail.postDeadline - this.roomDetail.signDeadline)) * 100;
      } else if (this.currentTime <= this.roomDetail.voteDeadline) {
        this.postProgress = 100;
        this.signProgress = 100;
        this.voteProgress = ((this.currentTime - this.roomDetail.postDeadline) / (this.roomDetail.voteDeadline - this.roomDetail.postDeadline)) * 100;
        this.phase = 2;
      } else {
        this.voteProgress = 100;
        this.signProgress = 100;
        this.postProgress = 100;
        this.end();
      }
    } else {
      this.signProgress = ((this.currentTime - this.startTime) / (this.roomDetail.signDeadline - this.startTime)) * 100;
    }
  }

  end() {
    if (!this.ended) {
      this.phase = 3;
      this.voteProgress = 100;
      this.randomize();
      this.ended = true;
    }
  }

  vote(proposalId: string, rate: number) {
    this.lunchWsService.voteForProposal(proposalId, rate);
  }

  delete(proposalId: string) {
    this.lunchWsService.deleteProposal(proposalId);
  }

  leave() {
    this.cookieService.delete('room');
    this.router.navigateByUrl('rooms');
  }

  private randomize() {
    var now = new Date().getTime();
    let confirmed = true;
    if (now < this.roomDetail.voteDeadline) {
      confirmed = confirm("You sure want to randomize before voting end?");
    }
    if (confirmed) {
      this.subscriptions.push(this.roomService.doTheLottery(this.roomDetail.roomId).subscribe({
        error: err => console.log(err)
      }));
    }
  }
}
