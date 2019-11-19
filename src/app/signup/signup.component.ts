import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/service/login.service';

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

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  signUp(nick: string, password: string) {
    this.loginService.signUp(nick, password).subscribe({
      next: (response) => console.log(response),
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
    }, 100);
  }

}
