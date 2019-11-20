import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from 'src/app/model/Room';
import { LoginService } from 'src/app/login/service/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private serverUrl = '/rooms';

  constructor(private http: HttpClient, private loginService: LoginService) { }

  public findRoomsByUserId(userId: string): Observable<Room[]> {
    return this.http.get<Room[]>(this.serverUrl, {
      params: {
        'userId': userId
      },
      headers: {
        'User-Nick': this.loginService.currentUser.nick,
        'User-Token': this.loginService.currentUser.token
      }
    });
  }
}
