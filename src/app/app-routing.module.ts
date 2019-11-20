import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RoomsComponent } from './rooms/rooms.component';


const routes: Routes = [
  { path: 'signUp', component: SignupComponent },
  { path: 'signIn', component: LoginComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: '', redirectTo: 'signIn', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
