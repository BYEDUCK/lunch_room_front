import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serverUrl = `${environment.serverUrl}/users`;
  private currentUser: User;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public signUp(userNick: string, userPassword: string): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/signUp', {
      nick: userNick,
      password: userPassword
    }, {
      headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public signIn(userNick: string, userPassword: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.serverUrl + '/signIn', {
      nick: userNick,
      password: userPassword
    }, {
      headers: {
        'Content-Type': ['application/json'],
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public isNickAvailable(userNick: string): Observable<object> {
    return this.http.get<object>(this.serverUrl + '/checkNick', {
      params: {
        nick: userNick
      },
      headers: {
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
  }

  public getCurrentUser(): User {
    if (!this.currentUser || this.currentUser === null) {
      this.currentUser = new User(
        this.cookieService.get('id'), this.cookieService.get('user'), this.cookieService.get('token')
      );
    }
    return this.currentUser;
  }
}

export class LoginResponse {
  constructor(public userId: string, public token: string) { }
}
