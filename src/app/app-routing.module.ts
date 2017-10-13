import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  // { path: '', component: AppComponent},
  // { path: 'signup', component: LoginComponent},
  // { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent},
  // { path: 'logout', component: LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
