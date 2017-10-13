import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TripsService } from '../../services/trips.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {
    username: '',
    password: ''
  };

  newUser: any = {
    username: '',
    email: '',
    password: ''
  }

  errorMessage: string = '';

  constructor(
    private api: UserService,
    private router: Router,
    private trips: TripsService
  ) { }

  ngOnInit() {
  }

  submitLogInForm() {
    this.api.postLogIn(this.user)
      .subscribe(
        (data: any) => {
          console.log('Login Success! ---> ', data);
          this.api.updateUserInfo(
            {
              isLoggedIn: true,
              userInfo: data
            }
          );
          //this.trips.updateTrips(data.trips[data.trips.length - 1]);
          this.router.navigate(['profile']);
          //this.goTo('.loc-form');
        },
        (err) => {
          console.log('Err Log In ----> ', err);
        }
      )
  }

  signupSubmit() {
    this.api.postSignup(this.newUser)
      .subscribe(
        (data) => {
          this.router.navigate(['profile']);
          //this.goTo('.loc-form');
        },

        (err) => {
          console.log('Error ---> ', err);
          if (err.status === 400) {
            this.errorMessage = 'Validation Error';
          }
          else {
            this.errorMessage = "Something went wrong. Try again later."
          }
        }
      )
  }

  goTo(selector) {
    //ev.preventDefault();
    const locForm = document.querySelector(selector) as HTMLElement;
    console.log(locForm);
    window.scrollTo(0, locForm.offsetTop);
  }

}
