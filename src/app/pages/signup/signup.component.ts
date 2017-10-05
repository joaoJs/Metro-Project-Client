import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  newUser: any = {
    username: '',
    email: '',
    password: ''
  }

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submitSignUpForm() {
    this.api.postSignUp(this.newUser)
      .subscribe(
        (data) => {
          console.log("New User ---> ", data);
          this.router.navigate(['login']);
        },
        (err) => {
          console.log("Err Signup --> ", err);
        }
      )
  }

}
