import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { CookieService } from 'ngx-cookie-service';

export class Message {
  constructor(public msg: string) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient;
  private isConnected = false;
  private sendingRetryIntervalId;
  private sessionId;

  constructor(private cookieService: CookieService) {
  }

  public connect(retrieveMsg, handleError, handleLotteryResults) {
    if (!this.stompClient) {
      let roomId = this.cookieService.get('room');
      let ws = new SockJS(`${environment.serverUrl}/propose`);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, frame => {
        var url = this.stompClient.ws._transport.url;
        url = url.replace(
          `${environment.serverWsUrl}/propose/`,  '');
        url = url.replace('/websocket', '');
        url = url.replace(/^[0-9]+\//, '');
        this.sessionId = url;
        this.isConnected = true;
        this.stompClient.subscribe(`/room/proposals/${roomId}`, message => {
          retrieveMsg(message);
        });
        this.stompClient.subscribe(`/room/errors/${this.sessionId}/gimme`, error => {
          handleError(error);
        });
        this.stompClient.subscribe(`/room/lottery/${roomId}`, results => {
          handleLotteryResults(results);
        });
      });
    }
  }

  public sendMessage(message: any) {
    if (this.isConnected) {
      this.stompClient.send('/app/propose', {}, JSON.stringify(message));
    } else {
      var sent = false;
      this.sendingRetryIntervalId = setInterval(() => {
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
        setTimeout(() => { }, 400);
        this.isConnected = false;
        this.stompClient = undefined;
      });
    }
  }
}
