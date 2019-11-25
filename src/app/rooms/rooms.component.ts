import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/User';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';
import { RoomService } from './service/room.service';
import { RoomSimple } from '../model/RoomSimple';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomsCreateComponent } from './create-room/rooms.create.component';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  public currentUser: User;
  public rooms: RoomSimple[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private loginService: LoginService, private router: Router,
    private roomService: RoomService, private modalService: NgbModal, private cookieService: CookieService
  ) {
    this.currentUser = loginService.getCurrentUser();
  }

  ngOnInit() {
    this.subscriptions.push(this.roomService.findRoomsByUserId(this.currentUser.id).subscribe({
      next: (response) => {
        console.log(response);
        this.rooms = response;
      },
      error: (err) => {
        console.log(err);
        this.router.navigateByUrl('signIn');
      },
      complete: () => { console.log('complete'); }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public openModal() {
    this.modalService.open(RoomsCreateComponent, {
      centered: true
    });
  }

  public joinRoom(roomName: string) {
    this.cookieService.set('room', roomName);
    this.router.navigateByUrl('room');
  }

}
