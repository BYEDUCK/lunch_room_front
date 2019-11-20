import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { LoginService } from './service/login.service';
import { User } from '../model/User';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterContentInit, OnDestroy {

  isError = false;
  isCompleted = false;
  userNick = '';
  routeSubscription: Subscription;

  constructor(private loginService: LoginService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    if (!this.routeSubscription) {
      this.routeSubscription = this.route.queryParamMap.subscribe(params => {
        console.log("reading from params: ", params.get("user"));
        this.userNick = params.get("user");
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  logIn(nick: string, pass: string) {
    this.loginService.signIn(nick, pass).subscribe({
      next: response => {
        this.loginService.setCurrentUser(new User(response.userId, nick, response.token));
        this.router.navigateByUrl("rooms");
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
    });
  }

}
