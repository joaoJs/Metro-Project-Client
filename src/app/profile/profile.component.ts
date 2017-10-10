import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {
    username: '',
    trips: [{origin: ''}]
  };

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // let's get user's name and trips from the db
    this.userService.getUser()
      .subscribe(
        (data) => {
          console.log("user info --> ", data);
          this.user = data;
        },
        (err) => {
          console.log('Err user info --> ', err);
        }
      )
  }

}
