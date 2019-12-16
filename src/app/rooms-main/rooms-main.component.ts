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

@Component({
  selector: "app-rooms-main",
  templateUrl: "./rooms-main.component.html",
  styleUrls: ["./rooms-main.component.css"]
})
export class RoomsMainComponent implements OnInit, OnDestroy {
  public roomDetail: RoomDetail;
  public currentUser: User;
  public phase = 0; // 0 - sign phase; 1 - post phase; 2 - vote phase
  subscriptions: Subscription[] = [];
  phaseCheckerIntervalId;
  proposalUpdateCheckerIntervalId;
  proposals: Proposal[] = [];
  proposalIdToIndex: Map<String, number> = new Map();

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
    this.proposalUpdateCheckerIntervalId = setInterval(() => {
      this.checkForProposalsUpdate();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.lunchWsService.disconnect();
    window.clearInterval(this.phaseCheckerIntervalId);
    window.clearInterval(this.proposalUpdateCheckerIntervalId);
  }

  phaseChecker() {
    var now = new Date().getTime();
    if (now > this.roomDetail.signDeadline) {
      if (now <= this.roomDetail.postDeadline) {
        this.phase = 1;
      } else {
        this.phase = 2;
        window.clearInterval(this.phaseCheckerIntervalId);
      }
    }
  }

  checkForProposalsUpdate() {
    const updatedProposals = this.lunchWsService.getLatestMessage();
    if (updatedProposals && updatedProposals.length > 0) {
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
  }

  vote(proposalId: string) {
    this.lunchWsService.voteForProposal(proposalId, 4);
  }
}
