import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

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
  private subscriptions: Subscription[] = [];

  constructor(private cookieService: CookieService) {
  }

  public connect(retrieveMsg, handleError, handleLotteryResults) {
    if (!this.stompClient) {
      let roomId = this.cookieService.get('room');
      let ws = new SockJS(`${environment.serverUrl}/propose`);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, frame => {
        var url = this.stompClient.ws._transport.url;
        url = url
          .replace(`${environment.serverWsUrl}/propose/`, '')
          .replace('/websocket', '')
          .replace(/^[0-9]+\//, '');
        this.sessionId = url;
        this.isConnected = true;
        this.subscriptions.push(this.stompClient.subscribe(`/room/proposals/${roomId}`, message => {
          retrieveMsg(message);
        }));
        this.subscriptions.push(this.stompClient.subscribe(`/room/errors/${this.sessionId}/gimme`, error => {
          handleError(error);
        }));
        this.subscriptions.push(this.stompClient.subscribe(`/room/lottery/${roomId}`, results => {
          handleLotteryResults(results);
        }));
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
        this.isConnected = false;
        this.stompClient = undefined;
        console.log('disconnected');
        setTimeout(() => {
          this.subscriptions.forEach(s => s.unsubscribe())
        }, 100);
      });
    }
  }
}
