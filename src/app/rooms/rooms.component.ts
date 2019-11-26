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
    const modalRef = this.modalService.open(RoomsCreateComponent, {
      centered: true
    });
    this.subscriptions.push(modalRef.componentInstance.addedRoom.subscribe(
      room => this.rooms.push(room),
      err => console.log(err),
      () => console.log('completed')
    ));
  }

  public toDate(millis: number): string {
    const date = new Date(millis);
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return `${date.getHours()}:${minutes}`;
  }

  public joinRoom(roomName: string) {
    this.cookieService.set('room', roomName);
    this.router.navigateByUrl('room');
  }

  public deleteRoom(id: string) {
    if (confirm('You sure want to delete this room?')) {
      this.subscriptions.push(this.roomService.deleteRoom(id).subscribe({
        next: resp => {
          console.log(resp);
          var newRooms = []
          newRooms = this.rooms.filter(r => r.roomId != id);
          this.rooms = newRooms;
        },
        error: err => console.log(err),
        complete: () => console.log('completed')
      }));
    }
  }

  public updateRoom(name: string) {
    const modalRef = this.modalService.open(RoomsCreateComponent, {
      centered: true
    });
    modalRef.componentInstance.update = true;
    modalRef.componentInstance.roomName = name;
    this.subscriptions.push(modalRef.componentInstance.updatedRoom.subscribe(
      room => {
        var newRooms = this.rooms.filter(r => r.roomName != name);
        newRooms.push(room);
        this.rooms = newRooms;
      },
      err => console.log(err),
      () => console.log('completed')
    ));
  }

}
