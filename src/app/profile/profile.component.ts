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
          //data.trips.dispTime = 0;
          this.user = data;
          data.trips.forEach((trip, i) => {
            console.log(trip.time);
            trip.distance = Math.floor(trip.distance);
            this.totalDistance += trip.distance;
            this.totalTime += trip.time;

            if (trip.time >= 3600) {
              let hours = Math.floor(trip.time / 3600);
              if (trip.time % 3600 > 0) {
                let mins = trip.time % 3600;
                this.user.trips[i].dispTime =  hours + 'hours and ' + mins + ' minutes.';
              } else {
              this.user.trips[i].dispTime =  hours + ' hours.'
              }
            } else if (trip.time >= 60 && trip.time < 3600) {
              let mins = trip.time % 60;
              this.user.trips[i].dispTime = mins + ' minutes.';
              console.log(this.user);
            }

            if (this.totalTime < 60 && this.totalTime > 0) {
              this.user.trips[i].dispTime = trip.time + ' seconds.'
            }

          });
        this.totalDistance = Math.floor(this.totalDistance);
        console.log('time -> ', this.totalTime);
        // lets transform seconds to ideal format
        if (this.totalTime >= 3600) {
          let hours = Math.floor(this.totalTime / 3600);
          if (this.totalTime % 3600 > 0) {
            let mins = (this.totalTime % 3600) % 60;
            this.time = 'Total Time: '+ hours + ' h and ' + mins + ' min.';
          } else {
          this.time = 'It has taken you ' + hours + ' hours.'
          }
        } else if (this.totalTime >= 60 && this.totalTime < 3600) {
          let mins = Math.floor(this.totalTime / 60);
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
