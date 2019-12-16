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
  private isConnected = false;
  private sendingRetryIntervalId;

  public connect(retrieveMsg) {
    if (!this.stompClient) {
      let ws = new SockJS(`${environment.serverUrl}/propose`);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, frame => {
        console.log('connected', frame);
        this.isConnected = true;
        this.stompClient.subscribe('/room/proposals', message => {
          retrieveMsg(message);
        });
      });
    }
  }

  public sendMessage(message: any) {
    var sent = false;
    if (this.isConnected) {
      this.stompClient.send('/app/propose', {}, JSON.stringify(message));
    } else {
      this.sendingRetryIntervalId = setInterval(() => {
        if (this.stompClient && !sent) {
          this.stompClient.send('/app/propose', {}, JSON.stringify(message));
          sent = true;
          window.clearInterval(this.sendingRetryIntervalId);
        }
      }, 500);
    }
  }

  public disconnect() {
    this.stompClient.disconnect(() => console.log('disconnected'));
  }
}
