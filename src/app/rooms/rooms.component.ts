import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';
import { RoomService } from './service/room.service';
import { RoomSimple } from '../model/RoomSimple';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomsCreateComponent } from './create-room/rooms.create.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  public currentUser: User;
  public rooms: RoomSimple[] = [];

  constructor(
    private loginService: LoginService, private router: Router,
    private roomService: RoomService, private modalService: NgbModal
  ) {
    this.currentUser = loginService.getCurrentUser();
  }

  ngOnInit() {
    this.roomService.findRoomsByUserId(this.currentUser.id).subscribe({
      next: (response) => {
        console.log(response);
        this.rooms = response;
      },
      error: (err) => {
        console.log(err);
        this.router.navigateByUrl('signIn');
      },
      complete: () => { console.log('complete'); }
    });
  }

  public openModal() {
      this.modalService.open(RoomsCreateComponent, {
        centered: true
      });
  }

  public joinRoom(roomName: string) {
    this.roomService.joinRoom(roomName).subscribe({
      next: response => {
        console.log(response);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      }
    });
  }

}
