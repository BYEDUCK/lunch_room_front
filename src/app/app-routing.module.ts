import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsMainComponent } from './rooms-main/rooms-main.component';


const routes: Routes = [
  { path: 'signUp', component: SignupComponent },
  { path: 'signIn', component: LoginComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'room', component: RoomsMainComponent },
  { path: '', redirectTo: 'signIn', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
