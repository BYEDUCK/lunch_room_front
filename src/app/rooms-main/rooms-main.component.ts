import { Component, OnInit, OnDestroy } from "@angular/core";
import { RoomDetail } from "../model/RoomDetail";
import { RoomService } from "../rooms/service/room.service";
import { LoginService } from "../login/service/login.service";
import { User } from "../model/User";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Proposal } from "../model/lunch/Proposal";
import { LunchWsService } from './service/lunch-ws.service';
import { LotteryResults } from '../model/LotteryResults';

@Component({
  selector: "app-rooms-main",
  templateUrl: "./rooms-main.component.html",
  styleUrls: ["./rooms-main.component.css"]
})
export class RoomsMainComponent implements OnInit, OnDestroy {
  public roomDetail: RoomDetail;
  public currentUser: User;
  public phase = 0; // 0 - sign phase; 1 - post phase; 2 - vote phase; 3 - end
  subscriptions: Subscription[] = [];
  phaseCheckerIntervalId;
  proposalUpdateCheckerIntervalId;
  proposals: Proposal[] = [];
  private proposalIdToIndex: Map<string, number> = new Map();
  errorMsg = '';
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
    private lunchWsService: LunchWsService
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
            this.phaseCheckerIntervalId = window.setInterval(
              () => this.phaseChecker(),
              1000
            );
            this.subscriptions.push(this.lunchWsService.newMessageEvent.subscribe({
              next: (updatedProposals: Proposal[]) => {
                if (updatedProposals && updatedProposals.length > 0) {
                  this.errorMsg = '';
                  updatedProposals.forEach(proposal => {
                    if (!this.proposalIdToIndex.has(proposal.proposalId)) {
                      const idx = this.proposals.push(proposal) - 1;
                      this.proposalIdToIndex.set(proposal.proposalId, idx);
                    } else {
                      const idx = this.proposalIdToIndex.get(proposal.proposalId);
                      this.proposals[idx] = proposal;
                    }
                  });
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
                this.errorMsg = err;
              }
            }));
            this.subscriptions.push(this.lunchWsService.lotteryResultsEvent.subscribe({
              next: (results: LotteryResults) => {
                this.winner = results.userNick;
                this.proposalWin = this.proposals[this.proposalIdToIndex.get(results.winnerProposalId)];
                this.summary = true;
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
    window.clearInterval(this.phaseCheckerIntervalId);
    window.clearInterval(this.proposalUpdateCheckerIntervalId);
  }

  phaseChecker() {
    this.currentTime = new Date().getTime();
    if (this.currentTime > this.roomDetail.signDeadline) {
      if (this.currentTime <= this.roomDetail.postDeadline) {
        this.phase = 1;
        this.signProgress = 100;
        this.postProgress = ((this.currentTime - this.roomDetail.signDeadline) / (this.roomDetail.postDeadline - this.roomDetail.signDeadline)) * 100;
      } else if (this.currentTime <= this.roomDetail.voteDeadline) {
        this.postProgress = 100;
        this.voteProgress = ((this.currentTime - this.roomDetail.postDeadline) / (this.roomDetail.voteDeadline - this.roomDetail.postDeadline)) * 100;
        this.phase = 2;
      } else {
        this.voteProgress = 100;
        this.end();
      }
    } else {
      this.signProgress = ((this.currentTime - this.startTime) / (this.roomDetail.signDeadline - this.startTime)) * 100;
    }
  }

  end() {
    if (!this.ended) {
      this.phase = 3;
      window.clearInterval(this.phaseCheckerIntervalId);
      this.randomize();
      this.errorMsg = '';
      this.ended = true;
    }
  }

  vote(proposalId: string) {
    this.lunchWsService.voteForProposal(proposalId, 4);
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
