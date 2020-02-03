import { Component, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';
import { RoomService } from '../service/room.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/model/Room';
import { TimeService } from 'src/app/time.service';

@Component({
    selector: 'app-rooms-create',
    templateUrl: './rooms.create.component.html'
})
export class RoomsCreateComponent implements OnInit, OnDestroy {

    public initDead: string;
    public voteDead: string;
    public isEverythingOk = true;
    public useDefaults: boolean;

    private initDefault = 5;
    private voteDefault = 5 + this.initDefault;

    subscriptions: Subscription[] = [];
    addedRoom: EventEmitter<Room> = new EventEmitter();
    updatedRoom: EventEmitter<Room> = new EventEmitter();
    @Input()
    update = false;
    @Input()
    room: Room;

    constructor(
        private roomService: RoomService,
        public activeModal: NgbActiveModal,
        private timeService: TimeService
    ) { }

    ngOnInit() {
        this.initDead = this.room ? this.timeService.toDateShort(this.room.initialDeadline) : this.timeService.addMinutesToNow(this.initDefault);
        this.voteDead = this.room ? this.timeService.toDateShort(this.room.voteDeadline) : this.timeService.addMinutesToNow(this.voteDefault);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    public createRoom(name: string) {
        this.subscriptions.push(this.roomService.addRoom(
            name, this.timeService.toMillis(this.initDead), this.timeService.toMillis(this.voteDead), this.useDefaults
        ).subscribe({
            next: response => {
                this.isEverythingOk = true;
                this.addedRoom.emit(response);
                this.activeModal.close('Successfully ended');
            },
            error: err => {
                this.isEverythingOk = false;
                console.log(err);
            },
            complete: () => {
                this.isEverythingOk = true;
            }
        }));
    }

    public updateRoom() {
        this.subscriptions.push(
            this.roomService.updateRoom(
                this.room.roomId, this.timeService.toMillis(this.initDead), this.timeService.toMillis(this.voteDead)
            ).subscribe({
                next: response => {
                    this.isEverythingOk = true;
                    this.updatedRoom.emit(response);
                    this.activeModal.close('Successfully ended');
                },
                error: err => {
                    console.log(err);
                },
                complete: () => {
                    console.log('completed');
                }
            }));
    }
}