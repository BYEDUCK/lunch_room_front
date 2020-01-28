import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/User';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';
import { RoomService } from './service/room.service';
import { Room } from '../model/Room';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomsCreateComponent } from './create-room/rooms.create.component';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { TimeService } from '../time.service';
import { SummariesResponse } from '../model/SummariesResponse';
import { SummaryPopupComponent, Summary } from '../summary-popup/summary-popup.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  public currentUser: User;
  public rooms: Room[] = [];
  subscriptions: Subscription[] = [];
  now: number = new Date().getTime();

  constructor(
    loginService: LoginService,
    private router: Router,
    private timerService: TimeService,
    private roomService: RoomService,
    private modalService: NgbModal,
    private cookieService: CookieService
  ) {
    this.currentUser = loginService.getCurrentUser();
    this.subscriptions.push(this.timerService.timeEvent.subscribe({
      next: (time: Date) => {
        this.now = time.getTime();
      }
    }));
  }

  ngOnInit() {
    this.subscriptions.push(this.roomService.findRoomsByUserId(this.currentUser.id).subscribe({
      next: (response) => {
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
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    return `${hours}:${minutes}`;
  }

  public joinRoomById(roomId: string) {
    this.cookieService.set('room', roomId);
    this.router.navigateByUrl('room');
  }

  public searchRoomByName(roomName: string) {
    this.subscriptions.push(this.roomService.findRoomByName(roomName).subscribe({
      next: resp => {
        this.rooms.push(resp);
      },
      error: err => {
        alert('Room not found!');
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      }
    }))
  }

  public deleteRoom(id: string) {
    if (confirm('You sure want to delete this room?')) {
      this.subscriptions.push(this.roomService.deleteRoom(id).subscribe({
        next: resp => {
          var newRooms = []
          newRooms = this.rooms.filter(r => r.roomId != id);
          this.rooms = newRooms;
        },
        error: err => console.log(err),
        complete: () => console.log('completed')
      }));
    }
  }

  public updateRoom(room: Room) {
    const modalRef = this.modalService.open(RoomsCreateComponent, {
      centered: true
    });
    modalRef.componentInstance.update = true;
    modalRef.componentInstance.room = room;
    this.subscriptions.push(modalRef.componentInstance.updatedRoom.subscribe(
      room => {
        var newRooms = this.rooms.filter(r => r.roomName != room.roomName);
        newRooms.push(room);
        this.rooms = newRooms;
      },
      err => console.log(err),
      () => console.log('completed')
    ));
  }

  public summary(roomId: string) {
    this.subscriptions.push(this.roomService.getSummary(roomId).subscribe({
      next: (response: SummariesResponse) => {
        const modalRef = this.modalService.open(SummaryPopupComponent, {
          centered: true
        });
        const summeries = response.summaries.map(sum => new Summary(this.timerService.toDateFull(sum.timestamp), sum.winnerNick, sum.winnerProposalTitle));
        modalRef.componentInstance.summaries = summeries;
      },
      error: err => console.log(err),
      complete: () => console.log('completed')
    }));
  }

}
