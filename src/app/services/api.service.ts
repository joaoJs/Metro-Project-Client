import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  baseUrl: string = environment.apiUrl;

  geoUrl:string = 'https://maps.googleapis.com/maps/api/geocode/json?';

  distanceUrl: string = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

  key: string = environment.googleApi;

  constructor(
    private http: HttpClient
  ) {
    }

  postSignUp(newUser: any) {
    return this.http.post(this.baseUrl + '/api/process-signup', newUser, {withCredentials:true});
  }

  postLogIn(user: any) {
    return this.http.post(this.baseUrl + '/api/process-login', user, {withCredentials: true});
  }

  /*getMap(location: string) {
    return this.http.get(this.googleGeo + '?' + location + '?' + this.key);
  }*/

  getMarkers() {
    const markers = JSON.parse(localStorage.getItem('markers'));
    return markers;
  }

  addMarker(newMarker: any) {
    // fetch markers
    const markers = JSON.parse(localStorage.getItem('markers'));
    // push them to array
    markers.push(newMarker);
    // set ls markers back
    localStorage.setItem('markers', JSON.stringify(markers));
  }

  updateMarker(marker: any,index: number, newLat: number, newLng: number) {
      console.log('Updating Marker... ');

      const markers = JSON.parse(localStorage.getItem('markers'));

      console.log("Marker ---> ", markers[index]);

      markers[index].lat = newLat;
      markers[index].lng = newLng;

      console.log("Marker ---> ", markers[index]);

      localStorage.setItem('markers', JSON.stringify(markers));
    }

    removeMarker(index: number) {
      const markers = JSON.parse(localStorage.getItem('markers'));
      markers.splice(index,1);
      localStorage.setItem('markers', JSON.stringify(markers));
    }

    clearLocalStorage() {
      localStorage.clear();
    }

    // uses the google geocoding api to get the coordinates of the location
    // based on user's input
    getOrigin(location: string) {
      return this.http.get(this.geoUrl + 'address=' + location + '&key=' + this.key);
    }

    getDestination(location: string) {
      return this.http.get(this.geoUrl + 'address=' + location + '&key=' + this.key);
    }

    // instead of calling distance matrix api here, we'll call it in the backend
    // so now we need to make a get request to the backend instead
    getDistance(lat: string, lng: string, coords: string, mode: string) {
      console.log({ lat, lng, coords,mode, key:this.key})
      return this.http.get(this.baseUrl + '/api/distance/'+ lat+ '/' +lng+ '/'+coords+'/'+mode+'/'+this.key);
    }

    // gets distance between metro lines.
    getDistanceMetro(lat: string, lng: string, coords: string) {
      console.log({ lat, lng, coords, key:this.key})
      return this.http.get(this.baseUrl + '/api/distance-metro/'+ lat+ '/' +lng+ '/' + coords + '/' +this.key);
    }

    getCarDistance(lat: string, lng: string, coords: string) {
      return this.http.get(this.baseUrl + '/api/distance-car/'+ lat+ '/' +lng+ '/' + coords + '/' +this.key);
    }


    // get array with all the stations from the database
    getStationsArray() {
      return this.http.get(this.baseUrl + '/api/stations');
    }

    postTrip(trip: any) {
      return this.http.post(this.baseUrl + '/api/trips', trip, {withCredentials: true});
    }

}
