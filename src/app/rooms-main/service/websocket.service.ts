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

  public connect(retrieveMsg, handleError) {
    if (!this.stompClient) {
      let ws = new SockJS(`${environment.serverUrl}/propose`);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, frame => {
        console.log('connected', frame);
        this.isConnected = true;
        this.stompClient.subscribe('/room/proposals', message => {
          retrieveMsg(message);
        });
        this.stompClient.subscribe('/room/errors', error => {
          handleError(error);
        });
      });
    }
  }

  public sendMessage(message: any) {
    if (this.isConnected) {
      this.stompClient.send('/app/propose', {}, JSON.stringify(message));
    } else {
      this.sendingRetryIntervalId = setInterval(() => {
        var sent = false;
        if (this.stompClient && !sent && this.stompClient.connected) {
          this.stompClient.send('/app/propose', {}, JSON.stringify(message));
          sent = true;
        }
        if (sent) {
          window.clearInterval(this.sendingRetryIntervalId);
        }
      }, 500);
    }
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('disconnected');
        setTimeout(() => {}, 400);
        this.isConnected = false;
        this.stompClient = undefined;
      });
    }
  }
}
