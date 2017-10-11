import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.logOut()
      .subscribe(
        (data) => {
          console.log('logged out --> ', data);
        },
        (err) => {
          console.log('err log out --> ', err);
        }
      )
  }

}
