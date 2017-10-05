import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  baseUrl: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient
  ) { }

  postSignUp(newUser: any) {
    return this.http.post(this.baseUrl + '/api/process-signup', newUser);
  }

  postLogIn(user: any) {
    return this.http.post(this.baseUrl + '/api/process-login', user);
  }

}
