import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { LoginService } from './service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentInit, OnDestroy {

  isError = false;
  isCompleted = false;
  userNick = '';
  subscritpions: Subscription[] = [];

  constructor(
    private loginService: LoginService, 
    private route: ActivatedRoute, 
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    let userNick = this.cookieService.get(environment.userNickCookieName);
    let token = this.cookieService.get(environment.tokenCookieName)
    if (token && token.length > 0 && userNick && userNick.length > 0) {
      this.router.navigateByUrl('rooms');
    }
    this.subscritpions.push(this.route.queryParamMap.subscribe(params => {
      this.userNick = params.get('user');
      let code = params.get('code');
      if (code && code.length > 0) {
        this.logInWithGoogleOAuth(code);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscritpions.forEach(sub => sub.unsubscribe());
  }

  logInWithGoogleOAuth(authorizationCode: string) {
    this.subscritpions.push(this.loginService.signInWithGoogle(authorizationCode).subscribe({
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.router.navigateByUrl('rooms');
        console.log('completed');
      }
    }));
  }

  logIn(nick: string, pass: string) {
    this.subscritpions.push(this.loginService.signIn(nick, pass).subscribe({
      error: err => {
        console.log(err);
        this.isError = true;
        this.isCompleted = false;
      },
      complete: () => {
        this.router.navigateByUrl('rooms');
        this.isCompleted = true;
        this.isError = false;
      }
    }));
  }

}
