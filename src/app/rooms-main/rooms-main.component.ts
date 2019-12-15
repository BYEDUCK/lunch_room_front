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
  proposals: Proposal[] = [];

  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router,
    private lunchWsService: LunchWsService
  ) {}

  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    const roomId = this.cookieService.get("room");
    const roomName = this.cookieService.get("roomName");
    if (roomId.length < 1 && roomName.length < 1) {
      this.router.navigateByUrl("rooms");
    } else if (roomId.length < 1) {
      this.subscriptions.push(
        this.roomService.joinRoomByName(roomName).subscribe({
          next: response => {
            console.log(response);
            this.roomDetail = response;
            this.cookieService.set("room", this.roomDetail.roomId);
            this.cookieService.delete("roomName");
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
            console.log("completed");
          }
        })
      );
    } else {
      this.subscriptions.push(
        this.roomService.joinRoomById(roomId).subscribe({
          next: response => {
            console.log(response);
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
            console.log("completed");
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.clearInterval(this.phaseCheckerIntervalId);
  }

  phaseChecker() {
    console.log("tic");
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

  proposalEventHandler($event) {
    this.proposals.push($event);
  }
}
