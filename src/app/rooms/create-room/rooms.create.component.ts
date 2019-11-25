import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from '../service/room.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

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

    private millisInDay = 24 * 60 * 60 * 1000;

    subscriptions: Subscription[] = [];

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
        var forYears = (now.getFullYear() - 1970) * this.getDaysInYear(now.getFullYear()) * this.millisInDay;
        var forMonths = (now.getMonth() + 1) * this.getDaysInMonth(now.getFullYear(), now.getMonth()) * this.millisInDay;
        var forDays = now.getDate() * this.millisInDay;
        return (+parts[0] * 60 + (+parts[1])) * 60 * 1000 + forYears + forMonths + forDays;
    }

    private isLeapYear(year: number): boolean {
        return year % 4 === 0 || (year % 100 === 0 && year % 400 !== 0);
    }

    private getDaysInYear(year: number): number {
        return this.isLeapYear(year) ? 366 : 365;
    }

    private getDaysInMonth(year: number, month: number): number {
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        }
        if (month === 2) {
            if (this.isLeapYear(year)) {
                return 29;
            } else {
                return 28;
            }
        }
        return 30;
    }
}