import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { Subject, Subscription } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class LunchWsService {
  public messageSubscription: Subscription;
  private roomId: string;

  constructor(
    private webSocketService: WebsocketService,
    private cookieService: CookieService
  ) {
    this.roomId = this.cookieService.get("room");
    if (!this.messageSubscription) {
      this.messageSubscription = this.webSocketService
        .connect(this.roomId)
        .subscribe({
          next: resp => console.log(resp),
          error: err => console.log(err),
          complete: () => console.log("Lunch WS: completed")
        });
    }
  }
}
