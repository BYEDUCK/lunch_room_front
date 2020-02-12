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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { MenuItem } from '../model/lunch/MenuItem';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-rooms-main",
  templateUrl: "./rooms-main.component.html",
  styleUrls: ["./rooms-main.component.css"]
})
export class RoomsMainComponent implements OnInit, OnDestroy {
  public roomDetail: Room;
  public currentUser: User;
  public phase = 0; // 0 - init phase; 1 - vote phase; 2 - end;
  roomUsers: RoomUser[] = [];
  subscriptions: Subscription[] = [];
  timeCheckingSubscription: Subscription;
  proposalUpdateCheckerIntervalId;
  starredProposals: Map<string, StarredProposal> = new Map();
  staring: Map<string, number> = new Map();
  summary = false;
  winner: string;
  proposalWin: Proposal;
  ended = false;
  public currentTime = new Date().getTime();
  public startTime = new Date().getTime();
  public initProgress = 0;
  public voteProgress = 0;
  defaultStarring = 3;

  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router,
    private lunchWsService: LunchWsService,
    private timeService: TimeService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    const roomId = this.cookieService.get(environment.roomIdCookieName);
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
                    this.starredProposals.set(proposal.proposalId, new StarredProposal(
                      proposal, this.starredProposals.has(proposal.proposalId) ? this.starredProposals.get(proposal.proposalId).starring : this.defaultStarring
                    ));
                  });
                  if (updatedProposals.total < this.starredProposals.size) {
                    this.starredProposals.forEach(starredProposal => {
                      if (!updatedProposals.proposals.includes(starredProposal.proposal)) {
                        this.starredProposals.delete(starredProposal.proposal.proposalId);
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
                this.proposalWin = this.starredProposals.get(results.winnerProposalId).proposal;
                this.summary = true;
                this.clearCheckers();
                this.voteProgress = 100;
                this.initProgress = 100;
                this.ended = true;
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
    if (this.currentTime > this.roomDetail.initialDeadline) {
      if (this.currentTime <= this.roomDetail.voteDeadline) {
        this.initProgress = 100;
        this.voteProgress = ((this.currentTime - this.roomDetail.initialDeadline) / (this.roomDetail.voteDeadline - this.roomDetail.initialDeadline)) * 100;
        this.phase = 1;
      } else {
        this.voteProgress = 100;
        this.initProgress = 100;
        this.end();
      }
    } else {
      this.initProgress = ((this.currentTime - this.startTime) / (this.roomDetail.initialDeadline - this.startTime)) * 100;
    }
  }

  end() {
    if (!this.ended) {
      this.phase = 2;
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
    this.subscriptions.push(this.roomService.leaveRoom(this.roomDetail.roomId).subscribe({
      error: err => console.log(err),
      complete: () => {
        this.cookieService.delete(environment.roomIdCookieName);
        this.router.navigateByUrl('rooms');
      }
    }));
  }

  createProposal() {
    this.modalService.open(CreateProposalComponent, { centered: true });
  }

  editProposal(proposalId: string) {
    let modalRef = this.modalService.open(CreateProposalComponent, { centered: true });
    let starredProposal = this.starredProposals.get(proposalId);
    modalRef.componentInstance.proposalId = proposalId;
    modalRef.componentInstance.proposalTitle = starredProposal.proposal.title;
    modalRef.componentInstance.proposalMenuUrl = starredProposal.proposal.menuUrl;
    let menuItemsCopy: MenuItem[] = []
    starredProposal.proposal.menuItems.forEach(item => menuItemsCopy.push(new MenuItem(item.description, item.price)));
    modalRef.componentInstance.menuItems = menuItemsCopy;
  }

  luckyShot() {
    if (confirm("You sure want to end by lucky shot?")) {
      this.subscriptions.push(this.roomService.doTheLuckyShot(this.roomDetail.roomId).subscribe({
        error: err => console.log(err)
      }));
    }
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

  setStarring(proposalId: string, starring: number) {
    this.starredProposals.get(proposalId).starring = starring;
  }
}

export class StarredProposal {
  constructor(public proposal: Proposal, public starring: number) {

  }
}
