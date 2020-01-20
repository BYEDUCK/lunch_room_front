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
    let url = environment.googleOAuthUrl
    + '?' + 'client_id=' + encodeURIComponent(environment.googleOAuthClientId)
    + '&' + 'nonce=' + '123'
    + '&' + 'response_type=' + 'code'
    + '&' + 'redirect_uri=' + encodeURIComponent(environment.googleOAuthRedirectUri)
    + '&' + 'scope=' + 'email';
    window.location.href = url;
  }
}
