import { Component, OnInit } from '@angular/core';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    console.log("In LoginService")
    this.loginService.signUp("test123", "test123").subscribe({
      next(response) { console.log(response) },
      error(err) { console.log(err.error) },
      complete() { console.log("completed") }
    })
  }

}
