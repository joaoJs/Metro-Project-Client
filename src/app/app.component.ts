import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TripsService } from './services/trips.service';
import { UserService } from './services/user.service';


declare var google: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userInfo: any;

  ngOnInit() {

    this.userService.loginStatusNotifier.subscribe(
      (userInfo) => {
        this.userInfo = userInfo.userInfo;
        console.log('from subject! --> ', userInfo);
        console.log('is logged in --> ', userInfo.isLoggedIn);
      }
    )

    // checks if user is logged in, and if so,
    // sets the user's info to req.user
    // the user info from the database is the req.user object
    this.userService.getLoginStatus()
      .subscribe(
        (user: any) =>{
          if (user.isLoggedIn) {
            this.userInfo = user.userInfo
          }
          else {
            this.userInfo = null;
          }
          console.log(this.userInfo);
        }

      )
  }

  markers: any[] = [];
  color: string = 'rgba(255,100,0,1)';
  colorNew: string = 'rgb(0,0,150)';
  locationName: string = "";
  destinationName: string = "";
  data: any = {};
  allDistances: number[] = [];
  sortedDistances: number[] = [];
  closestStOr: string = '';
  closestStDest: string = '';
  locOr: string = '';
  latOr: number;
  lngOr: number;
  coords: string = '';
  latDest: number;
  lngDest: number;
  locDest: string = '';
  sortedDistancesOr: number[] = [];
  sortedDistancesDest: number[] = [];
  indexOr: number;
  indexDest: number;
  closestStOrLat: number;
  closestStOrLng: number;
  closestStDestLat: number;
  closestStDestLng: number;
  completeDist: number = 0;
  distDest: number;
  distOr: number;
  distSt: number;
  completeDistMessage: string = '';
  travelModeOr: string = '';
  travelModeDest: string = '';
  timeOr: number;
  timeDest: number;
  timeMetro: number;
  timeTotal: number = 0;
  stationsArray: any[] = [];
  arrToCalc: any[] = [];
  tripObj: any = {};


  // the following stations arrays are used to determine the
  //coordinates for the polylines

  // exhisting stations
  stations: any[] = [
       {lat: 25.7810171, lng: -80.19628360000002},
       {lat: 25.776034, lng: -80.196061},
       {lat: 25.7638502, lng: -80.195425},
       {lat: 25.7497383, lng: -80.211783},
       {lat: 25.7397915, lng: -80.2388733},
       {lat: 25.7329031, lng: -80.25484279999999},
       {lat: 25.7148675, lng: -80.2770295},
       {lat: 25.7050916, lng: -80.2890178},
       {lat: 25.6919369, lng: -80.3051089},
       {lat: 25.6850431, lng: -80.3136722}
    ];

   // new stations south
   newStations: any[] = [
      {lat: 25.6850431, lng: -80.3136722},
      {lat: 25.644235, lng: -80.3383722},
      {lat: 25.6298189, lng: -80.3457406},
      {lat: 25.6104121, lng: -80.359949},
      {lat: 25.6071269, lng: -80.39927949999999}
    ]

    // new stations north
    newStationsNorth: any[] = [
      {lat: 25.7810171, lng: -80.19628360000002},
      {lat: 25.8011729, lng: -80.20023049999999},
      {lat: 25.8081475, lng: -80.1936675},
      {lat: 25.8134218, lng: -80.1934285}
    ]

  constructor(
    private markerService: ApiService,
    private activatedThang: ActivatedRoute,
    private router: Router,
    private tripsService: TripsService,
    private userService: UserService
  ) {
    // this.markers = this.markerService.getMarkers();
  }

  title = 'app';
  // set initial coordinates to Miami
  lat: number = 25.7617;
  lng: number = -80.1918;
  zoom: number = 10;


    // functions that transpose units of measure

    getMiles(i) {
        return i*0.000621371192;
    }

    kmToMiles(i) {
        return i*0.621371;
    }

    sToMin(i) {
        let res = '';
        if (i >= 60) {
          res = Math.floor(i / 60) + ' minutes and ' + i % 60 + ' seconds';
        } else {
          res = i + 'seconds';
        }
        return res;
    }

  newMarker: any = {};
  markerName: string = "";
  markerLat: string = "";
  markerLng: string = "";

  markerClicked(marker: any, index: number) {
    console.log(marker.name + " was clicked at " + index + " position.");
  }

  mapClicked($event: any) {
    console.log('clicked');
    this.newMarker = {
      name: 'Untitled',
      lat: $event.coords.lat,
      lng: $event.coords.lng
    }

  this.markers.push(this.newMarker);
  }

  clearMarkers() {
    this.markerService.clearLocalStorage();
  }


  // adds new marker based on coordinates
  // markers will be added at the trip's origin and destination
  addMarker(location: string, lat: number, lng: number) {
    console.log('Adding Marker.');

    this.newMarker = {
      name: location,
      lat: lat,
      lng: lng
    }
    console.log(this)
    this.markers.push(this.newMarker);
  }

  markerDragEnd(marker: any,index: number, $event: any) {
    console.log('Dragend -> ', marker, $event);

    const upMarker = {
      name: marker.name,
      lat: parseFloat(marker.lat),
      lng: parseFloat(marker.lng)
    }

    console.log("UPMARKER ---> ",   upMarker);

    const newLat = $event.coords.lat;
    const newLng = $event.coords.lng;

    this.markerService.updateMarker(upMarker,index, newLat, newLng);

  }

  removeMarker(marker: any, index: number) {
    console.log('Removing marker...');
    this.markers.splice(index,1);
    this.markerService.removeMarker(index);
  }

  errorMessageForm: string = '';

  submitLocations() {
    // check if all inputs were provided
    if (this.locationName === '' ||
        this.travelModeOr === '' ||
        this.destinationName === '' ||
        this.travelModeDest === '') {
          this.errorMessageForm = 'Please provide all fields.';
    } else {

      this.errorMessageForm = '';




  // gets the stations array from the database


  this.markerService.getStationsArray()
    .subscribe(
      (data: any) => {
        console.log('stArr! -----> ', data);
        this.stationsArray = data;
        console.log('the real array ---> ',this.stationsArray);



    //gets the trip's origin information based on the user's input
    // response gives the formatted address and the coordinates.
    this.markerService.getOrigin(this.locationName)
      .subscribe(
        (response) => {
          console.log('response Origin --> ', response);
          console.log("TRAVEL MODE!! ---->", this.travelModeOr);
          this.locOr = response['results'][0].formatted_address;
          this.latOr = response['results'][0].geometry.location.lat;
          this.lngOr = response['results'][0].geometry.location.lng;
          // adding marker
          this.addMarker(this.locOr,this.latOr,this.lngOr);

          // formate all the coordinates into an string to use in the URL
          // for the next API request
          this.coords = this.stationsArray.map(s => s.latLng.lat + ',' + s.latLng.lng).join('|');

          // uses coords string to find the distance between user's origin and all of the stations
          // this will allow us to know which one is the closest station
          // it also sends the travel mode from the origin until the metro, so that the result
          // is more specific
          this.markerService.getDistance(String(this.latOr), String(this.lngOr), this.coords, this.travelModeOr)
            .subscribe(
              (data) => {
                console.log("distances Work!---> ", data);
                // get array of distances from response
                const distArray = data['rows'][0].elements;
                // sort array of distances, and pair the distances with their index and add duration!
                this.sortedDistancesOr = distArray.map((d,i) => [Number((d.distance.text).slice(0,-3)), i, d.duration.value])
                  .sort((a,b) => a[0] - b[0]);
                console.log(this.sortedDistancesOr);
                this.indexOr = this.sortedDistancesOr[0][1];

                this.closestStOr = this.stationsArray[this.indexOr]['name'];
                this.distOr = this.kmToMiles(this.sortedDistancesOr[0][0]);
                this.timeOr = this.sortedDistancesOr[0][2];
                this.timeTotal += this.timeOr;
                const timeOrMess = this.sToMin(this.timeOr);

                //gets the trip's destination information based on the user's input
                // response gives the formatted address and the coordinates.
                this.markerService.getDestination(this.destinationName)
                  .subscribe(
                    (response) => {
                      this.locDest = response['results'][0].formatted_address;
                      this.latDest = response['results'][0].geometry.location.lat;
                      this.lngDest = response['results'][0].geometry.location.lng;
                      this.addMarker(this.locDest,this.latDest,this.lngDest);

                      console.log(this.coords);

                      // uses the same coords string to find the distance between all of the stations and the user's origin
                      // this will allow us to know which one is the closest station
                      // it also sends the travel mode from the station until destination, so that the result
                      // is more specific
                      this.markerService.getDistance(String(this.latDest), String(this.lngDest), this.coords, this.travelModeDest)
                        .subscribe(
                          (data) => {
                            console.log("distances Destination ---> ", data);
                            console.log("dist array Dest --> ", data['rows'][0].elements);
                            const distArray = data['rows'][0].elements;
                            this.sortedDistancesDest = distArray.map((d,i) => [Number((d.distance.text).slice(0,-3)), i, d.duration.value])
                              .sort((a,b) => a[0] - b[0]);
                            this.indexDest = this.sortedDistancesDest[0][1];

                            this.closestStDest = this.stationsArray[this.indexDest]['name'];
                            this.distDest = this.kmToMiles(this.sortedDistancesDest[0][0]);
                            this.timeDest = this.sortedDistancesDest[0][2];
                            this.timeTotal += this.timeDest;
                            const timeDestMess = this.sToMin(this.timeDest);


                            console.log('BOTH!!! HERE!!! ---> ', this.closestStOr, this.closestStDest);

                            // now we need to get the closest stations' lat and lng
                            this.closestStOrLat = this.stationsArray[this.indexOr]['latLng']['lat'];
                            this.closestStOrLng = this.stationsArray[this.indexOr]['latLng']['lng'];
                            this.closestStDestLat = this.stationsArray[this.indexDest]['latLng']['lat'];
                            this.closestStDestLng = this.stationsArray[this.indexDest]['latLng']['lng'];

                            console.log("closest Station origin lat ---> ", this.closestStOrLat);
                            // now we need to query the distance between metro stations
                            // but first we need to format the destination's coords
                            const destCoords = this.closestStDestLat + ',' + this.closestStDestLng;

                                    // let's get the section we need to calculate.
                                    // for that we need to know if train is going south or north
                                    if (this.indexOr < this.indexDest) {
                                      this.arrToCalc = this.stationsArray.slice(this.indexOr, this.indexDest);
                                    } else {
                                      this.arrToCalc = this.stationsArray.slice(this.indexDest, this.indexOr);
                                    }

                                    console.log('ARR TO CALC!! ----> ', this.arrToCalc);
                                    let dist = 0;

                                    let time = 0;

                                    this.arrToCalc.forEach(s => {
                                      console.log(s.timeToNext);
                                      dist += s.distToNext;
                                      time += s.timeToNext;
                                    });

                                    // convert time to seconds and add it to total time
                                    this.timeTotal += time * 60;
                                    console.log("timeTotal! ---> ", this.timeTotal);
                                    const timeTotalMess = this.sToMin(this.timeTotal);

                                    console.log("DIST! ----> ", this.getMiles(dist));
                                    console.log("TIME!!! ---> ", time);
                                    this.distSt = this.getMiles(dist);
                                    this.completeDist = this.distOr + this.distDest + this.distSt;
                                    console.log('COMPLETE! ---> ', this.completeDist);

                                    this.completeDistMessage = `Your total trajectory is ${Math.floor(this.completeDist)} miles long.
                                                                You are ${this.distOr.toFixed(1)} miles away from ${this.closestStOr} station and your destination is
                                                                ${this.distDest.toFixed(1)} miles away from ${this.closestStDest} Station.
                                                                Total time will be ${timeTotalMess}.
                                                                `;

                                    this.tripObj = {
                                      origin: this.locOr,
                                      destination: this.locDest,
                                      time: this.timeTotal,
                                      distance: this.completeDist
                                    };


                                    this.timeTotal = 0;

                              // finally, let's get the entire distance by car using the origin and dest info

                              this.markerService.getCarDistance(String(this.latOr),String(this.lngOr),this.latDest+','+this.lngDest)
                                .subscribe(
                                  (data: any) => {
                                    console.log('car distance --> ', data);
                                    this.completeDistMessage +=  ` Considering the current traffic, it should take you ${data.rows[0].elements[0].duration_in_traffic.text} to drive to your destination`;
                                  },
                                  (err) => {
                                    console.log('err ---> ', err);
                                  }
                                )


                          },
                          (err) => {
                            console.log("err --> ", err);
                          }
                        )
                    },
                    (err) => {
                      console.log(err);
                    }
                  )
              },
              (err) => {
                console.log("err --> ", err);
              }
            )
        },
        (err) => {
          console.log('err --> ', err);
        }
      )
    },
    (err) => {
      console.log('Err first stArr ---> ', err);
    }
  )

  }

  }

  saveTrip() {
    console.log(this.tripObj);
    // we need to send the trip object to save on users trip
    this.markerService.postTrip(this.tripObj)
      .subscribe(
        (data: any) => {
          console.log('Saved Trip --> ',data);
          // reset tripObj to empty obj
          this.router.navigate(['profile']);
          //goTo()
          this.tripsService.updateTrips(data);
          this.goTo('_', '.profile-wrapper');
        },
        (err) => {
          console.log('ERR --> ', err);
        }
      )

  }

  // function to scroll page to specific sections
  goTo(ev, selector) {
    if (ev !== '_') {
      ev.preventDefault();
    }
    const locForm = document.querySelector(selector) as HTMLElement;
    console.log(locForm);
    window.scrollTo(0, locForm.offsetTop);
  }

  // function to logout
  logMeOut() {

    this.userService.logOut()
      .subscribe(
        (data) => {
          console.log('Log Out Success! ---> ', data);
          // this.router.navigate(['/login']);
          this.goTo('_','.auth-form');
        },
        (err) => {
          console.log("err logout --> ", err);
        }
      )
  }

}
