import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  baseUrl: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  getUser() {
    return this.http.get(this.baseUrl + '/api/user', {withCredentials:true});
  }

}
