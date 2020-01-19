import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomsComponent } from './rooms/rooms.component';
import { CookieService } from 'ngx-cookie-service';
import { RoomsCreateComponent } from './rooms/create-room/rooms.create.component';
import { NgbModalModule, NgbProgressbarModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoomsMainComponent } from './rooms-main/rooms-main.component';
import { CreateProposalComponent } from './rooms-main/create-proposal/create-proposal.component';
import { SummaryComponent } from './rooms-main/summary/summary.component';
import { SummaryPopupComponent } from './summary-popup/summary-popup.component';
import { CustomModalComponent } from './custom-modal/custom-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RoomsComponent,
    RoomsCreateComponent,
    RoomsMainComponent,
    CreateProposalComponent,
    SummaryComponent,
    SummaryPopupComponent,
    CustomModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgbModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [
    RoomsCreateComponent,
    SummaryPopupComponent,
    CreateProposalComponent,
    CustomModalComponent
  ]
})
export class AppModule { }
