import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomSimple } from 'src/app/model/RoomSimple';
import { LoginService } from 'src/app/login/service/login.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { RoomDetail } from 'src/app/model/RoomDetail';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private serverUrl = `${environment.serverUrl}/rooms`;

  private roomDetail: RoomDetail;

  constructor(private http: HttpClient, private loginService: LoginService, private cookieService: CookieService) { }

  public findRoomsByUserId(userId: string): Observable<RoomSimple[]> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.get<RoomSimple[]>(this.serverUrl, {
      params: {
        'userId': userId
      },
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public findRoomByName(roomName: string): Observable<RoomSimple> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.get<RoomSimple>(`${this.serverUrl}/search`, {
      params: {
        'name': roomName
      },
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public addRoom(name: string, signDead: number, postDead: number, voteDead: number): Observable<RoomSimple> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<RoomSimple>(this.serverUrl, {
      'name': name,
      'ownerId': currentUser.id,
      'deadlines': {
        'signDeadline': signDead,
        'postDeadline': postDead,
        'voteDeadline': voteDead
      }
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public joinRoomById(roomId: string): Observable<RoomDetail> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<RoomDetail>(this.serverUrl + '/join', {
      'userId': currentUser.id,
      'roomId': roomId
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public joinRoomByName(roomName: string): Observable<RoomDetail> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<RoomDetail>(this.serverUrl + '/joinByName', {
      'userId': currentUser.id,
      'roomName': roomName
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public deleteRoom(id: string): Observable<any> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.delete<any>(this.serverUrl + `/${id}`, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public updateRoom(roomId: string, signDead: number, postDead: number, voteDead: number): Observable<RoomSimple> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.put<RoomSimple>(this.serverUrl, {
      'roomId': roomId,
      'deadlines': {
        'signDeadline': signDead,
        'postDeadline': postDead,
        'voteDeadline': voteDead
      }
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public doTheLottery(roomId: string): Observable<any> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<any>(`${this.serverUrl}/random`, {
      'userId': currentUser.id,
      'roomId': roomId
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public cacheRoomDetail(detail: RoomDetail) {
    this.roomDetail = detail;
  }

  public getCachedRoomDetail(): RoomDetail {
    return this.roomDetail;
  }
}
