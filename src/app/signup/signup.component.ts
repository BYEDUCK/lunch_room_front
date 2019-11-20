import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/service/login.service';
import { Router } from '@angular/router';

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
  isNickAvailable = false;
  isEverythingOk = false;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  signUp(nick: string, password: string) {
    this.loginService.signUp(nick, password).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`/signIn?user=${nick}`);
      },
      error: (err) => console.log(err),
      complete: () => {
        console.log('success');
        this.isCompleted = true;
      }
    });
  }

  passChange() {
    setTimeout(() => {
      this.passwordsMatch = this.pass.length > 0 && this.confirmPass.length > 0 && this.pass === this.confirmPass;
      this.isEverythingOk = this.passwordsMatch;
    }, 100);
  }

  checkNick(userNick: string) {
    if (!userNick || userNick.length == 0) {
      this.isNickAvailable = false;
      this.isEverythingOk = false;
      return;
    }
    setTimeout(() => {
      this.loginService.isNickAvailable(userNick).subscribe({
        next: (response) => {
          this.isNickAvailable = true;
          this.isEverythingOk = true;
        },
        error: (err) => {
          this.isNickAvailable = false;
          this.isEverythingOk = false;
        },
        complete: () => { console.log("completed"); }
      });
    }, 200);
  }

}
