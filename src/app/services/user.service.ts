import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUser() {
    return this.http.get(this.baseUrl + '/api/user', {withCredentials:true});
  }

  logOut() {
    const logoutRequest =
      this.http.post(
      this.baseUrl + '/api/logout',
      { withCredentials: true }
    );

    return logoutRequest;
  }

}
