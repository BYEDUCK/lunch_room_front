import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  nick: string;
  pass = '';
  confirmPass = '';
  passwordsMatch = false;
  isCompleted = false;
  isNickAvailable = true;
  isEverythingOk = false;
  tryAgain = false;
  private nickCheckTerms = new Subject<string>();

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.nickCheckTerms
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(nick => {
        this.loginService.isNickAvailable(nick).subscribe({
          next: (response) => {
            this.isNickAvailable = true;
            this.isEverythingOk = this.passwordsMatch;
          },
          error: (err) => {
            this.isNickAvailable = false;
            this.isEverythingOk = false;
          },
          complete: () => { console.log("completed"); }
        });
      })
  }

  signUp(nick: string, password: string) {
    this.loginService.signUp(nick, password).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`/signIn?user=${nick}`);
      },
      error: (err) => {
        console.log(err);
        this.tryAgain = true;
      },
      complete: () => {
        console.log('success');
        this.isCompleted = true;
      }
    });
  }

  passChange() {
    this.passwordsMatch = this.pass.length > 0 && this.confirmPass.length > 0 && this.pass === this.confirmPass;
    if (this.passwordsMatch) {
      this.isEverythingOk = this.isNickAvailable;
    }
  }

  checkNick(userNick: string) {
    if (!userNick || userNick.length == 0) {
      this.isNickAvailable = true;
      this.isEverythingOk = false;
    } else {
      this.nickCheckTerms.next(userNick);
    }
  }

}
