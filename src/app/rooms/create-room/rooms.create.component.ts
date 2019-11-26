import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { RoomService } from '../service/room.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RoomSimple } from 'src/app/model/RoomSimple';

@Component({
    selector: 'app-rooms-create',
    templateUrl: './rooms.create.component.html'
})
export class RoomsCreateComponent implements OnInit, OnDestroy {

    public signDead: string;
    public postDead: string;
    public voteDead: string;
    public isEverythingOk = true;

    private signDefault = 15;
    private postDefault = 10 + this.signDefault;
    private voteDefault = 5 + this.postDefault;

    subscriptions: Subscription[] = [];
    @Output()
    addedRoom: EventEmitter<RoomSimple> = new EventEmitter();

    constructor(private roomService: RoomService, public activeModal: NgbActiveModal) { }

    ngOnInit() {
        this.signDead = this.addMinutesToNow(this.signDefault);
        this.postDead = this.addMinutesToNow(this.postDefault);
        this.voteDead = this.addMinutesToNow(this.voteDefault);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    public createRoom(name: string) {
        this.subscriptions.push(this.roomService.addRoom(name, this.toMillis(this.signDead), this.toMillis(this.postDead), this.toMillis(this.voteDead))
            .subscribe({
                next: response => {
                    console.log(response);
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

    private addMinutesToNow(min: number): string {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var newMinutes = (minutes + min) % 60;
        var newHours = hours + Math.floor((minutes + min) / 60);
        var minuteStringPart = newMinutes < 10 ? "0" + newMinutes : "" + newMinutes;
        return "" + newHours + ":" + minuteStringPart;
    }

    private toMillis(time: string): number {
        var now = new Date();
        var parts = time.split(":");
        var minutes = (+parts[0]) * 60 + (+parts[1]) + now.getTimezoneOffset();
        return Date.UTC(
            now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            Math.floor(minutes / 60), minutes % 60, 0, 0
        );
    }
}