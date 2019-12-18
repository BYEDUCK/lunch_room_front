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
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RoomsMainComponent } from './rooms-main/rooms-main.component';
import { CreateProposalComponent } from './rooms-main/create-proposal/create-proposal.component';
import { SummaryComponent } from './rooms-main/summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RoomsComponent,
    RoomsCreateComponent,
    RoomsMainComponent,
    CreateProposalComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  entryComponents: [RoomsCreateComponent]
})
export class AppModule { }
