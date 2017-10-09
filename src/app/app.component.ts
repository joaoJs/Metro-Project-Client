import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

declare var google: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  markers: any[];

  color: string = 'rgb(255,0,0)';

  colorNew: string = 'rgb(0,0,255)';

  locationName: string = "";

  destinationName: string = "";

  data: any = {};

  allDistances: number[] = [];

  sortedDistances: number[] = [];

  closestMessageOrigin: string = '';

  closestMessageDest: string = '';

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

  stationsArray: any[] = [];

  constructor(
    private markerService: ApiService
  ) {
    this.markers = this.markerService.getMarkers();
  }

  title = 'app';
  lat: number = 25.7617;
  lng: number = -80.1918;
  zoom: number = 10;

    getMiles(i) {
        return i*0.000621371192;
    }

    kmToMiles(i) {
        return i*0.621371;
    }

  newMarker: any = {};

  markerName: string = "";
  markerLat: string = "";
  markerLng: string = "";
  //markerDraggable: string = "No";

  markerClicked(marker: any, index: number) {
    console.log(marker.name + " was clicked at " + index + " position.");
  }

  mapClicked($event: any) {
    console.log('clicked');
    this.newMarker = {
      name: 'Untitled',
      lat: $event.coords.lat,
      lng: $event.coords.lng
      //draggable: false
    }

  this.markers.push(this.newMarker);
  }

  clearMarkers() {
    this.markerService.clearLocalStorage();
  }

  addMarker(location: string, lat: number, lng: number) {
    console.log('Adding Marker.');
    // let bool = false;
    // if (this.markerDraggable === 'Yes') {
    //   bool = true;
    // } else {
    //   bool = false;
    // }
    this.newMarker = {
      name: location,
      lat: lat,
      lng: lng
      //draggable: bool
    }

    this.markers.push(this.newMarker);
    this.markerService.addMarker(this.newMarker);
  }

  markerDragEnd(marker: any,index: number, $event: any) {
    console.log('Dragend -> ', marker, $event);

    const upMarker = {
      name: marker.name,
      lat: parseFloat(marker.lat),
      lng: parseFloat(marker.lng)
      //draggable: marker.draggable
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


  submitLocations() {

  this.markerService.getStationsArray()
    .subscribe(
      (data: any) => {
        console.log('stArr! -----> ', data);
        this.stationsArray = data;
        console.log('the real array ---> ',this.stationsArray);





    this.markerService.getOrigin(this.locationName)
      .subscribe(
        (response) => {
          console.log('response Origin --> ', response);
          console.log("TRAVEL MODE!! ---->", this.travelModeOr);
          this.locOr = response['results'][0].formatted_address;
          this.latOr = response['results'][0].geometry.location.lat;
          this.lngOr = response['results'][0].geometry.location.lng;
          this.addMarker(this.locOr,this.latOr,this.lngOr);
          //this.coords = this.allStations.map(s => s.lat + ',' + s.lng).join('|');
          this.stationsArray.forEach(s=> console.log(s.latLng));
          this.coords = this.stationsArray.map(s => s.latLng.lat + ',' + s.latLng.lng).join('|');

          this.markerService.getDistance(String(this.latOr), String(this.lngOr), this.coords, this.travelModeOr)
            .subscribe(
              (data) => {
                console.log("distances Work!---> ", data);
                //console.log("dist array --> ", data['rows'][0].elements);
                // get array of distances from response
                const distArray = data['rows'][0].elements;
                //console.log("DistArray! ---> ", distArray);
                // sort array of distances, and pair the distances with their index and add duration!
                this.sortedDistancesOr = distArray.map((d,i) => [Number((d.distance.text).slice(0,-3)), i, d.duration.value])
                  .sort((a,b) => a[0] - b[0]);
                console.log(this.sortedDistancesOr);
                this.indexOr = this.sortedDistancesOr[0][1];

                this.closestStOr = this.stationsArray[this.indexOr]['name'];
                this.distOr = this.kmToMiles(this.sortedDistancesOr[0][0]);
                this.timeOr = this.sortedDistancesOr[0][2]; // --> convert as needed
                this.closestMessageOrigin = `The closest station to your origin is ${this.closestStOr}. The distance is ${this.distOr} miles and it should take you ${this.timeOr} seconds to make this trajectory.`;

                this.markerService.getDestination(this.destinationName)
                  .subscribe(
                    (response) => {
                      this.locDest = response['results'][0].formatted_address;
                      this.latDest = response['results'][0].geometry.location.lat;
                      this.lngDest = response['results'][0].geometry.location.lng;
                      this.addMarker(this.locDest,this.latDest,this.lngDest);

                      console.log(this.coords);
                      this.markerService.getDistance(String(this.latDest), String(this.lngDest), this.coords, this.travelModeDest)
                        .subscribe(
                          (data) => {
                            console.log("distances Destination ---> ", data);
                            console.log("dist array Dest --> ", data['rows'][0].elements);
                            const distArray = data['rows'][0].elements;
                            this.sortedDistancesDest = distArray.map((d,i) => [Number((d.distance.text).slice(0,-3)), i, d.duration.value])
                              .sort((a,b) => a[0] - b[0]);
                            this.indexDest = this.sortedDistancesDest[0][1];

                            this.closestStOr = this.stationsArray[this.indexOr]['name'];
                            this.distDest = this.kmToMiles(this.sortedDistancesDest[0][0]);
                            this.timeDest = this.sortedDistancesDest[0][2]
                            this.closestMessageDest = `The closest station to your destination is ${this.closestStDest}. The distance is ${this.distDest} miles and it should take you ${this.timeDest} seconds to make this trajectory.`;

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


                                    const arrToCalc = this.stationsArray.slice(this.indexOr, this.indexDest);
                                    console.log('ARR TO CALC!! ----> ', arrToCalc);
                                    let dist = 0;

                                    let time = 0;

                                    arrToCalc.forEach(s => {
                                      console.log(s.timeToNext);
                                      dist += s.distToNext;
                                      time += s.timeToNext;
                                    });

                                    console.log("DIST! ----> ", this.getMiles(dist));
                                    console.log("TIME!!! ---> ", time);
                                    this.distSt = this.getMiles(dist);
                                    this.completeDist = this.distOr + this.distDest + this.distSt;
                                    console.log('COMPLETE! ---> ', this.completeDist);

                                    this.completeDistMessage = `Your total trajectory is ${this.completeDist} miles long.
                                                                You need to walk ${this.distOr} miles towards ${this.closestStOr} station and
                                                                ${this.distDest} from ${this.closestStDest} station to ${this.locDest}`;





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
