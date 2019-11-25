import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomDetail } from '../model/RoomDetail';
import { RoomService } from '../rooms/service/room.service';
import { LoginService } from '../login/service/login.service';
import { User } from '../model/User';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms-main',
  templateUrl: './rooms-main.component.html',
  styleUrls: ['./rooms-main.component.css']
})
export class RoomsMainComponent implements OnInit, OnDestroy {

  public roomDetail: RoomDetail;
  public currentUser: User;
  subscriptions: Subscription[] = [];

  constructor(
    private roomService: RoomService, private loginService: LoginService, private cookieService: CookieService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentUser = this.loginService.getCurrentUser();
    const roomName = this.cookieService.get('room');
    if (roomName.length < 1) {
      this.router.navigateByUrl('rooms');
    } else {
      this.subscriptions.push(this.roomService.joinRoom(roomName).subscribe({
        next: response => {
          console.log(response);
          this.roomDetail = response;
        },
        error: err => {
          console.log(err);
          this.router.navigateByUrl('rooms');
        },
        complete: () => {
          console.log('completed');
        }
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
