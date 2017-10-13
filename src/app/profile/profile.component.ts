import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TripsService } from '../services/trips.service';

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

  goTo(ev, selector) {
    if (ev !== '_') {
      ev.preventDefault();
    }
    const locForm = document.querySelector(selector) as HTMLElement;
    console.log(locForm);
    window.scrollTo(0, locForm.offsetTop);
  }

  totalDistance: number = 0;

  totalTime: number = 0;

  newTripTime: number = 0;

  distance: string = '';

  time: string = '';

  constructor(
    private userService: UserService,
    private tripsService: TripsService
  ) { }

  ngOnInit() {

    this.goTo('_','.profile-wrapper');

    this.updateProfile();

  }


  updateProfile() {
    this.tripsService.tripSubject$.subscribe(
      (user: any) => {
        const newTrip = user.trips[user.trips.length - 1];
        newTrip.distance = Math.floor(newTrip.distance);


        this.totalDistance += newTrip.distance;

        console.log("Total Time Before --> ", this.totalTime);
        this.totalTime += newTrip.time;
        console.log("Total Time After --> ",this.totalTime);

        if (newTrip.time >= 3600) {
          let hours = Math.floor(newTrip.time / 3600);
          if (newTrip.time % 3600 > 0) {
            let mins = newTrip.time % 3600;
            newTrip.dispTime =  hours + 'hours and ' + mins + ' minutes.';
          } else {
          newTrip.dispTime =  hours + ' hours.'
          }
        } else if (newTrip.time >= 60 && newTrip.time < 3600) {
          let mins = Math.floor(newTrip.time / 60);
          newTrip.dispTime = mins + ' minutes.';

        }

        if (newTrip.time < 60 && newTrip.time > 0) {
          newTrip.dispTime = newTrip.time + ' seconds.'
        }
        console.log('newTrip Data! --> ', newTrip);

        this.user.trips.push(newTrip);
        console.log('after pushing--> ', this.user);

        if (this.totalTime >= 3600) {
          let hours = Math.floor(this.totalTime / 3600);
          if (this.totalTime % 3600 > 0) {
            let mins = (this.totalTime % 3600) % 60;
            this.time = 'Total Time: '+ hours + ' h and ' + mins + ' min.';

          } else {
          this.time = 'Total time: ' + hours + ' hours.'
          }
        } else if (this.totalTime >= 60 && this.totalTime < 3600) {
          let mins = Math.floor(this.totalTime / 60);
          this.time = 'Total time: ' + mins + ' minutes.';
        }

        if (this.totalTime < 60 && this.totalTime > 0) {
          this.time = 'Total time: ' +this.totalTime + 'seconds.'
        }

        if (this.totalTime === 0) {
          this.time = "You haven't commuted yet.";
        }
        // update user in the db
        // this.userService.updateUser(this.user)
        //   .subscribe(
        //     (updatedUser) => {
        //       console.log('success update! -> ', updatedUser);
        //     },
        //     (err) => {
        //       console.log('err update --> ', err);
        //     }
        //   )
        console.log('subscribe subject time ****', this.time)
      }
    )

    // let's get user's name and trips from the db
    this.userService.getUser()
      .subscribe(
        (data: any) => {
          console.log("user info --> ", data);
          //data.trips.dispTime = 0;
          this.user = data;
          console.log('TOTAL TIME HERE!!!! ---> ', this.totalTime);
          console.log('NEW TRIP TIME ---> ', this.newTripTime);
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
              let mins = Math.floor(trip.time /  60);
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
          this.time = 'Total time: ' + hours + ' hours.'
          }
        } else if (this.totalTime >= 60 && this.totalTime < 3600) {
          let mins = Math.floor(this.totalTime / 60);
          this.time = 'Total time: ' + mins + ' minutes.';
        }

        if (this.totalTime < 60 && this.totalTime > 0) {
          this.time = 'Total time: ' +this.totalTime + 'seconds.'
        }

        if (this.totalTime === 0) {
          this.time = "You haven't commuted yet.";
        }

        console.log('get user time ****', this.time)

        },
        (err) => {
          console.log('Err user info --> ', err);
        }

      )
  }



}
