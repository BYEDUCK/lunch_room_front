import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: Subject<MessageEvent>;

  constructor() { }

  public connect(roomId: string) {
    if (!this.subject) {
      this.subject = this.createSubject(roomId);
      console.log('connected!!');
    }
    return this.subject;
  }

  private createSubject(roomId: string): Subject<MessageEvent> {
    let ws = new WebSocket(`${environment.serverWsUrl}/propose`);
    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  } 
}
