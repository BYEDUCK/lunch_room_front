import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from 'src/app/model/Room';
import { LoginService } from 'src/app/login/service/login.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private serverUrl = '/rooms';

  constructor(private http: HttpClient, private loginService: LoginService, private cookieService: CookieService) { }

  public findRoomsByUserId(userId: string): Observable<Room[]> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.get<Room[]>(this.serverUrl, {
      params: {
        'userId': userId
      },
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }
}
