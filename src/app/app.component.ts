import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LUNCHROOM';

  constructor(public router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
  }

  logout() {
    this.cookieService.delete('user');
    this.cookieService.delete('token');
    this.cookieService.delete('id');
    this.cookieService.delete('room');
    this.router.navigateByUrl('signIn');
  }
}
