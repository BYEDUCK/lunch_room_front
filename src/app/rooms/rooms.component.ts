import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';
import { RoomService } from './service/room.service';
import { Room } from '../model/Room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  private currentUser: User;
  private rooms: Room[];

  constructor(private loginService: LoginService, private router: Router, private roomService: RoomService) {
    this.currentUser = loginService.currentUser;
  }

  ngOnInit() {
    if (!this.currentUser || this.currentUser === null) {
      this.router.navigateByUrl('signIn');
    } else {
      this.roomService.findRoomsByUserId(this.currentUser.id).subscribe({
        next: (response) => {
          console.log(response);
          this.rooms = response;
        },
        error: (err) => { console.log(err); },
        complete: () => { console.log('complete'); }
      });
    }
  }

}
