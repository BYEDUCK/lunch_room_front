import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TimeService } from './time.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'LUNCHROOM';

  hours: string = '--';
  minutes: string = '--';
  seconds: string = '--';
  timeSubscription: Subscription;

  constructor(
    public router: Router,
    private cookieService: CookieService,
    private timeService: TimeService
  ) {
    if (!this.timeSubscription) {
      this.timeSubscription = this.timeService.timeEvent.subscribe({
        next: (time: Date) => {
          this.hours = this.timeService.twoDigits(time.getHours());
          this.minutes = this.timeService.twoDigits(time.getMinutes());
          this.seconds = this.timeService.twoDigits(time.getSeconds());
        }
      });
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  logout() {
    this.cookieService.delete('user');
    this.cookieService.delete('token');
    this.cookieService.delete('id');
    this.cookieService.delete('room');
    this.router.navigateByUrl('signIn');
  }

  signWithGoogle() {
    this.authenticateUser();
  }

  private authenticateUser() {
    let url = environment.googleOAuthUrl
    + '?' + 'client_id=' + encodeURIComponent(environment.googleOAuthClientId)
    + '&' + 'nonce=' + '123'
    + '&' + 'response_type=' + 'code'
    + '&' + 'redirect_uri=' + encodeURIComponent(environment.googleOAuthRedirectUri)
    + '&' + 'scope=' + 'email';
    window.location.href = url;
  }
}
