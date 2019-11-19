import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private serverUrl = "/users";

  constructor(private http: HttpClient) { }

  public signUp(userNick: string, userPassword: string): Observable<Object> {
    return this.http.post(this.serverUrl + "/signUp", {
      nick: userNick,
      password: userPassword
    }, {
      headers: {
        "Content-Type": ["application/json"]
      }
    });
  }

  public signIn(userNick: string, userPassword: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.serverUrl + "/signIn", {
      nick: userNick,
      password: userPassword
    })
  }
}

export class LoginResponse {
  constructor(userId: string, token: string) { }
}
