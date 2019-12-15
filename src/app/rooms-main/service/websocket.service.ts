import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

export class Message {
  constructor(public msg: string) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Stomp.Client;

  public connect() {
    let ws = new SockJS(`${environment.serverUrl}/propose`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, frame => {
      console.log('connected', frame);
      this.stompClient.subscribe('/room/proposals', message => {
        console.log(message);
      });
    })
  }

  public sendMessage(message: string) {
    this.stompClient.send('/app/propose', {}, JSON.stringify(new Message(message)));
  }
}
