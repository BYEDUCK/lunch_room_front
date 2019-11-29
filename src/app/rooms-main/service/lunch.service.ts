import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/login/service/login.service';
import { MenuItem } from 'src/app/model/lunch/MenuItem';
import { Observable } from 'rxjs';
import { Proposal } from 'src/app/model/lunch/Proposal';
import { VoteSummary } from 'src/app/model/lunch/VoteSummary';

@Injectable({
  providedIn: 'root'
})
export class LunchService {

  private serverUrl = `${environment.serverUrl}/lunch`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  public addProposal(roomId: string, title: string, menuItems: MenuItem[]): Observable<Proposal> {
    const currentUser = this.loginService.getCurrentUser();
    console.log({
      'userId': currentUser.id,
      'roomId': roomId,
      'title': title,
      'menuItems': menuItems
    });
    return this.http.post<Proposal>(this.serverUrl, {
      'userId': currentUser.id,
      'roomId': roomId,
      'title': title,
      'menuItems': menuItems
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }

  public voteForProposal(roomId: string, proposalId: string, rating: number): Observable<VoteSummary> {
    const currentUser = this.loginService.getCurrentUser();
    return this.http.post<VoteSummary>(`${this.serverUrl}/vote`, {
      'userId': currentUser.id,
      'roomId': roomId,
      'proposalId': proposalId,
      'rating': rating
    }, {
      headers: {
        'User-Nick': currentUser.nick,
        'User-Token': currentUser.token,
        'Access-Control-Allow-Origin': `${environment.serverUrl}/**`
      }
    });
  }
}
