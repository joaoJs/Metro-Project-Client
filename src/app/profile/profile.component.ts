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

  distance: string = '';

  time: string = '';

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
            console.log(trip.time);
            this.totalDistance += trip.distance;
            this.totalTime += trip.time;
          });
        this.totalDistance = Math.floor(this.totalDistance);

        // lets transform seconds to ideal format
        if (this.totalTime >= 3600) {
          let hours = Math.floor(this.totalTime / 3600);
          if (this.totalTime % 3600 > 0) {
            let mins = this.totalTime % 3600;
            this.time = 'It has taken you' + hours + ' hours and ' + mins + ' minutes.';
          } else {
          this.time = 'It has taken you ' + hours + ' hours.'
          }
        } else {
          let mins = this.totalTime % 60;
          this.time = 'It has taken you ' + mins + ' minutes.';
        }

        if (this.totalTime < 60 && this.totalTime > 0) {
          this.time = 'It has taken you ' +this.totalTime + 'seconds.'
        }

        if (this.totalTime === 0) {
          this.time = "You haven't commuted yet.";
        }

        },
        (err) => {
          console.log('Err user info --> ', err);
        }
      )
  }

}
