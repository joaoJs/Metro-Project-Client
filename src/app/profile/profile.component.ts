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

  totalDistance: number = 0;

  totalTime: number = 0;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // let's get user's name and trips from the db
    this.userService.getUser()
      .subscribe(
        (data: any) => {
          console.log("user info --> ", data);
          this.user = data;
          data.trips.forEach(trip => {
            this.totalDistance += trip.distance;
            this.totalTime += trip.time;
          });
        },
        (err) => {
          console.log('Err user info --> ', err);
        }
      )
  }

}
