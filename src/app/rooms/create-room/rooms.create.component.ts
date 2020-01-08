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

    public signDead: string;
    public postDead: string;
    public voteDead: string;
    public isEverythingOk = true;
    public useDefaults: boolean;

    private signDefault = 2;
    private postDefault = 2 + this.signDefault;
    private voteDefault = 5 + this.postDefault;

    subscriptions: Subscription[] = [];
    addedRoom: EventEmitter<Room> = new EventEmitter();
    updatedRoom: EventEmitter<Room> = new EventEmitter();
    @Input()
    update = false;
    @Input()
    room: Room;

    constructor(private roomService: RoomService, public activeModal: NgbActiveModal, private timeService: TimeService) { }

    ngOnInit() {
        this.signDead = this.room ? this.timeService.toDateShort(this.room.signDeadline) : this.timeService.addMinutesToNow(this.signDefault);
        this.postDead = this.room ? this.timeService.toDateShort(this.room.postDeadline) : this.timeService.addMinutesToNow(this.postDefault);
        this.voteDead = this.room ? this.timeService.toDateShort(this.room.voteDeadline) : this.timeService.addMinutesToNow(this.voteDefault);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    public createRoom(name: string) {
        this.subscriptions.push(this.roomService.addRoom(
            name, this.timeService.toMillis(this.signDead), this.timeService.toMillis(this.postDead), this.timeService.toMillis(this.voteDead), this.useDefaults
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
                this.room.roomId, this.timeService.toMillis(this.signDead), this.timeService.toMillis(this.postDead), this.timeService.toMillis(this.voteDead)
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