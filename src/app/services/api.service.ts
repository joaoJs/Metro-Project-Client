import { Injectable } from '@angular/core';
//import { Init } from '../init-markers';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService /*extends Init*/ {

  baseUrl: string = 'http://localhost:3000';

  geoUrl:string = 'https://maps.googleapis.com/maps/api/geocode/json?';

  distanceUrl: string = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

  key: string = 'AIzaSyBZmlw9qWUNZvc1jbUEZ8HQXHGTHXe3Jm4';

  constructor(
    private http: HttpClient
  ) {
    // super();
    // console.log("MarkerService Initialized");
    // this.load();
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

    getOrigin(location: string) {
      return this.http.get(this.geoUrl + 'address=' + location + '&key=' + this.key);
    }

    getDestination(location: string) {
      return this.http.get(this.geoUrl + 'address=' + location + '&key=' + this.key);
    }

    // instead of calling distance matrix api here, we'll call it in the backend
    // so now we need to make a get request to the backend instead
    getDistance(lat: string, lng: string, coords: string, mode: string) {
      // const props = {
      //   lat: lat,
      //   lng: lng,
      //   coords: coords,
      //   mode: mode,
      //   key: this.key
      // }
      console.log({ lat, lng, coords,mode, key:this.key})
      return this.http.get(this.baseUrl + '/api/distance/'+ lat+ '/' +lng+ '/'+coords+'/'+mode+'/'+this.key);

      //return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + coords + '&mode=' + mode + '&key=' + this.key);
    }

    // getDistance(lat: string, lng: string, coords: string, mode: string) {
    //   //return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + lat2 + ',' + lng2 + '&key=' + this.key);
    //   return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + coords + '&mode=' + mode + '&key=' + this.key);
    // }


    getDistanceMetro(lat: string, lng: string, coords: string) {
      // const props = {
      //   lat: lat,
      //   lng: lng,
      //   coords: coords,
      //   key: this.key
      // }
      console.log({ lat, lng, coords, key:this.key})
      return this.http.get(this.baseUrl + '/api/distance-metro/'+ lat+ '/' +lng+ '/' + coords + '/' +this.key);

      //return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + coords + '&mode=' + mode + '&key=' + this.key);
    }

    // getDistanceMetro(lat: string, lng: string, coords: string) {
    //   //return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + lat2 + ',' + lng2 + '&key=' + this.key);
    //   return this.http.get(this.distanceUrl + 'origins=' + lat + ',' + lng + '&destinations=' + coords + '&mode=transit&key=' + this.key);
    // }

    getStationsArray() {
      return this.http.get(this.baseUrl + '/api/stations');
    }

    postTrip(trip: any) {
      return this.http.post(this.baseUrl + '/api/trips', trip, {withCredentials: true});
    }
}
