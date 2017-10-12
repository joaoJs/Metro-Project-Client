import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  baseUrl: string = environment.apiUrl;

  // the thing that receive the changes
  loginStatusSubject = new BehaviorSubject<any>({isLoggedIn: false});

  // the thing that broadcasts the changes
  loginStatusNotifier = this.loginStatusSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  updateUserInfo(info) {
    this.loginStatusSubject.next(info);
  }

  postSignup(userInfo: any) {
    const signUpRequest =
      this.http.post(
      this.baseUrl + '/api/process-signup',
      userInfo,
      { withCredentials: true }
    );

    // logs the user in when he signs up.
    signUpRequest.subscribe(
      (user) => {
        console.log('sign up success! --> ', user);
        this.loginStatusSubject.next({
          isLoggedIn: true,
          userInfo: userInfo
        });
      }
    );

    return signUpRequest;
  }

  postLogIn(info: any) {
    const loginRequest =
      this.http.post(
      this.baseUrl + '/api/process-login',
      info,
      { withCredentials: true }
    );

    loginRequest.subscribe(
      (user) => {
        this.loginStatusSubject.next({
          isLoggedIn: true,
          userInfo: user
        });
      }
    );

    return loginRequest;


  }

  getUser() {
    return this.http.get(this.baseUrl + '/api/user', {withCredentials:true});
  }

  getLoginStatus() {
    const loginStatusRequest =
      this.http.get(
      this.baseUrl + '/api/checklogin',
      { withCredentials: true }
    );

    loginStatusRequest.subscribe(
      (user) => {
        this.loginStatusSubject.next(
          user
        );
      },
      (err) => {
        console.log('err login status --> ', err);
      }
    )
    return loginStatusRequest;
  }

  logOut() {
    console.log('before request for logout');
    const logoutRequest =
      this.http.delete(
      this.baseUrl + '/api/logout',
      { withCredentials: true }
    );

    logoutRequest.subscribe(
      () => {
        this.loginStatusSubject.next(
          { isLoggedIn: false }
        );
      }
    )

    return logoutRequest;
  }

}
