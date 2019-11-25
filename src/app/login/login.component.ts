import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { LoginService } from './service/login.service';
import { User } from '../model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

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
    private loginService: LoginService, private route: ActivatedRoute, private router: Router, private cookieService: CookieService
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    this.subscritpions.push(this.route.queryParamMap.subscribe(params => {
      this.userNick = params.get('user');
    }));
  }

  ngOnDestroy(): void {
    this.subscritpions.forEach(sub => sub.unsubscribe());
  }

  logIn(nick: string, pass: string) {
    this.subscritpions.push(this.loginService.signIn(nick, pass).subscribe({
      next: response => {
        this.cookieService.set('user', nick);
        this.cookieService.set('token', response.token);
        this.cookieService.set('id', response.userId);
        this.router.navigateByUrl('rooms');
      },
      error: err => {
        console.log(err);
        this.isError = true;
        this.isCompleted = false;
      },
      complete: () => {
        this.isCompleted = true;
        this.isError = false;
      }
    }));
  }

}
