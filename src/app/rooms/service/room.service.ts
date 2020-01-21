import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from 'src/app/model/Room';
import { LoginService } from 'src/app/login/service/login.service';
import { environment } from 'src/environments/environment';
import { SummariesResponse } from 'src/app/model/SummariesResponse';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private serverUrl = `${environment.serverUrl}/rooms`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

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

  public findRoomByName(roomName: string): Observable<Room> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.get<Room>(`${this.serverUrl}/search`, {
      params: {
        'name': roomName
      },
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }

  public addRoom(name: string, signDead: number, postDead: number, voteDead: number, useDefaults: boolean): Observable<Room> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<Room>(this.serverUrl, {
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
        'User-Token': currentUser.token
      },
      params: {
        'defaults': '' + (useDefaults ? useDefaults : 'false')
      }
    });
  }

  public joinRoomById(roomId: string): Observable<Room> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<Room>(this.serverUrl + '/join', {
      'userId': currentUser.id,
      'roomId': roomId
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }

  public joinRoomByName(roomName: string): Observable<Room> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<Room>(this.serverUrl + '/joinByName', {
      'userId': currentUser.id,
      'roomName': roomName
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }

  public deleteRoom(id: string): Observable<any> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.delete<any>(this.serverUrl + `/${id}`, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }

  public updateRoom(roomId: string, signDead: number, postDead: number, voteDead: number): Observable<Room> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.put<Room>(this.serverUrl, {
      'roomId': roomId,
      'deadlines': {
        'signDeadline': signDead,
        'postDeadline': postDead,
        'voteDeadline': voteDead
      }
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
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
        'User-Token': currentUser.token
      }
    });
  }

  public getSummary(roomId: string): Observable<SummariesResponse> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<SummariesResponse>(`${this.serverUrl}/summary`, {
      'userId': currentUser.id,
      'roomId': roomId
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token
      }
    });
  }
}
