import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public findRoomForUser(): Observable<Room[]> {
    return this.http.get<Room[]>(this.serverUrl, {
      withCredentials: true
    });
  }

  public findRoomByName1(roomName: string): Observable<Room> {
    return this.http.get<Room>(`${this.serverUrl}/byName`, {
      params: {
        'name': roomName
      },
      withCredentials: true
    });
  }

  public findRoomByName(roomName: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.serverUrl}/search`, {
      params: {
        'name': roomName
      },
      withCredentials: true
    });
  }

  public addRoom(name: string, initDead: number, voteDead: number, useDefaults: boolean): Observable<Room> {
    return this.http.post<Room>(this.serverUrl, {
      'name': name,
      'deadlines': {
        'initialDeadline': initDead,
        'voteDeadline': voteDead
      }
    }, {
      params: {
        'defaults': '' + (useDefaults ? useDefaults : 'false')
      },
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public joinRoomById(roomId: string): Observable<Room> {
    return this.http.post<Room>(this.serverUrl + '/join', {
      'roomId': roomId
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public leaveRoom(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/leave`, {
      'roomId': roomId
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public deleteRoom(id: string): Observable<any> {
    return this.http.delete<any>(this.serverUrl + `/${id}`, {
      withCredentials: true
    });
  }

  public updateRoom(roomId: string, initDead: number, voteDead: number): Observable<Room> {
    return this.http.put<Room>(this.serverUrl, {
      'roomId': roomId,
      'deadlines': {
        'initialDeadline': initDead,
        'voteDeadline': voteDead
      }
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public doTheLottery(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/random`, {
      'roomId': roomId
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public doTheLuckyShot(roomId: string): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/lucky_shot`, {
      'roomId': roomId
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }

  public getSummary(roomId: string): Observable<SummariesResponse> {
    return this.http.post<SummariesResponse>(`${this.serverUrl}/summary`, {
      'roomId': roomId
    }, {
      headers: new HttpHeaders().append(environment.contentTypeHeaderName, environment.applicationJsonHeaderValue),
      withCredentials: true
    });
  }
}
