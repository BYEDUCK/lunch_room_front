import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serverUrl = `${environment.serverUrl}/users`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  public signUp(userNick: string, userPassword: string): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/signUp', {
      nick: userNick,
      password: userPassword
    });
  }

  public signIn(userNick: string, userPassword: string): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/signIn', {
      nick: userNick,
      password: userPassword
    }, {
      withCredentials: true
    });
  }

  public signInWithGoogle(authorizationCode: string): Observable<any> {
    return this.http.post<any>(this.serverUrl + '/signIn/oauth/google', {}, {
      params: {
        'code': authorizationCode
      },
      withCredentials: true
    });
  }

  public isNickAvailable(userNick: string): Observable<any> {
    return this.http.get<any>(this.serverUrl + '/checkNick', {
      params: {
        nick: userNick
      }
    });
  }

  public getCurrentUser(): User {
    const currentUser = new User(
      this.cookieService.get(environment.userIdCookieName), 
      this.cookieService.get(environment.userNickCookieName), 
      this.cookieService.get(environment.tokenCookieName)
    );
    if (this.isStringValid(currentUser.id)
      && this.isStringValid(currentUser.nick)
      && this.isStringValid(currentUser.token)
    ) {
      return currentUser;
    } else {
      this.router.navigateByUrl('signIn');
    }
  }

  public deleteAllAppCookies() {
    this.cookieService.delete(environment.userNickCookieName);
    this.cookieService.delete(environment.tokenCookieName);
    this.cookieService.delete(environment.userIdCookieName);
    this.cookieService.delete(environment.roomIdCookieName);
  }

  private isStringValid(s: string): boolean {
    return s !== undefined || s !== null || s.length > 0;
  }
}

export class LoginResponse {
  constructor(public userId: string, public userNick: string, public token: string) { }
}
