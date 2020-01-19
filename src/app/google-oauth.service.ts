import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleOauthService {

  constructor(private httpClient: HttpClient, private modalService: NgbModal) { }

  public authenticateUser() {
    this.httpClient.post<any>(encodeURI(environment.googleOAuthUrl), {}, {
      params: {
        'client_id': environment.googleOAuthClientId,
        'nonce': '123',
        'response_type': 'code',
        'redirect_uri': environment.googleOAuthRedirectUri,
        'scope': 'email'
      }
    }).subscribe({
      next: resp => {
        let modalRef = this.modalService.open(CustomModalComponent, { centered: true });
        modalRef.componentInstance.template = resp;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log('completed');
      }
    })
  }
}
