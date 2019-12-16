import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { CookieService } from "ngx-cookie-service";
import { MenuItem } from 'src/app/model/lunch/MenuItem';
import { User } from 'src/app/model/User';
import { LoginService } from 'src/app/login/service/login.service';
import { Router } from '@angular/router';
import { Proposal } from 'src/app/model/lunch/Proposal';



@Injectable({
  providedIn: "root"
})
export class LunchWsService {
  private currentUser: User;
  private roomId: string;
  public messages: string[] = []

  constructor(
    private webSocketService: WebsocketService,
    private cookieService: CookieService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.connect();
  }

  public connect() {
    this.currentUser = this.loginService.getCurrentUser();
    this.roomId = this.cookieService.get('room');
    if (this.roomId.length < 1) {
      this.router.navigateByUrl('rooms');
    }
    this.webSocketService.connect(msg => this.retrieveMsg(msg));
  }

  retrieveMsg(message: any) {
    this.messages.push(message.body);
  }

  public getLatestMessage(): Proposal[] {
    if (this.messages.length > 0) {
      return JSON.parse(this.messages.shift());
    }
  }

  public disconnect() {
    this.webSocketService.disconnect();
  }

  public addProposal(title: string, menuItems: MenuItem[]) {
    this.webSocketService.sendMessage(
      {
        'lunchRequestType': 'ADD',
        'roomId': this.roomId,
        'userId': this.currentUser.id,
        'title': title,
        'menuItems': menuItems
      }
    );
  }

  public voteForProposal(proposalId: string, rating: number) {
    this.webSocketService.sendMessage(
      {
        'lunchRequestType': 'VOTE',
        'proposalId': proposalId,
        'roomId': this.roomId,
        'userId': this.currentUser.id,
        'rating': rating
      }
    );
  }

  public findAllProposals() {
    this.webSocketService.sendMessage(
      {
        'lunchRequestType': 'FIND',
        'roomId': this.roomId,
        'userId': this.currentUser.id
      }
    );
  }
}
