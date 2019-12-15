import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { Subject, Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";



@Injectable({
  providedIn: "root"
})
export class LunchWsService {
  private roomId: string;

  constructor(
    webSocketService: WebsocketService,
    private cookieService: CookieService
  ) {
    this.roomId = this.cookieService.get("room");
    webSocketService.connect();
    setTimeout(() => webSocketService.sendMessage('123'), 200);
  }
}
