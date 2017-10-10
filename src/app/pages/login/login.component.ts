import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
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

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submitLogInForm() {
    this.api.postLogIn(this.user)
      .subscribe(
        (data) => {
          console.log('Login Success! ---> ', data);
          this.router.navigate(['']);
        },
        (err) => {
          console.log('Err Log In ----> ', err);
        }
      )
  }

}
