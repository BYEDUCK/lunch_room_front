import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private now: Date = new Date();

  public timeEvent: EventEmitter<Date> = new EventEmitter();

  constructor() {
    setInterval(() => {
      this.now = new Date();
      this.timeEvent.emit(this.now);
    }, 1000)
  }

  public addMinutesToNow(min: number): string {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var newMinutes = (minutes + min) % 60;
    var newHours = hours + Math.floor((minutes + min) / 60);
    var hoursStringPart = this.twoDigits(newHours);
    var minuteStringPart = this.twoDigits(newMinutes);
    return hoursStringPart + ":" + minuteStringPart;
  }

  public toMillis(time: string): number {
    var now = new Date();
    var parts = time.split(":");
    var minutes = (+parts[0]) * 60 + (+parts[1]) + now.getTimezoneOffset();
    return Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      Math.floor(minutes / 60), minutes % 60, 0, 0
    );
  }

  public toDateShort(millis: number): string {
    const date = new Date(millis);
    var minutes = this.twoDigits(date.getMinutes());
    var hours = this.twoDigits(date.getHours());
    return hours + ':' + minutes;
  }

  public toDateFull(millis: number): string {
    const date = new Date(millis);
    var minutes = this.twoDigits(date.getMinutes());
    var hours = this.twoDigits(date.getHours());
    var seconds = this.twoDigits(date.getSeconds());
    var day = this.twoDigits(date.getDate());
    var month = this.twoDigits(date.getMonth() + 1);
    var year = this.twoDigits(date.getFullYear());
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  public twoDigits(n: number) {
    return n < 10 ? '0' + n : n;
  }

  public getNow(): Date {
    return this.now;
  }
}
