import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/do';

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
    return(
      this.http.post(
        this.baseUrl + '/api/process-signup',
        userInfo,
        { withCredentials: true }
      )
      .do(
        (user) => {
          console.log('sign up success! --> ', user);
          this.loginStatusSubject.next({
            isLoggedIn: true,
            userInfo: userInfo
          });
        }
      )
    );
  }

  postLogIn(info: any) {
    return (
      this.http.post(
      this.baseUrl + '/api/process-login',
      info,
      { withCredentials: true }
    )
    .do(
      (user) => {
        this.loginStatusSubject.next({
          isLoggedIn: true,
          userInfo: user
        });
      }
    )
  );


  }

  getUser() {
    return this.http.get(this.baseUrl + '/api/user', {withCredentials:true});
  }

  getLoginStatus() {
    return(
      this.http.get(
      this.baseUrl + '/api/checklogin',
      { withCredentials: true }
    )
    .do(
      (user) => {
        this.loginStatusSubject.next(
          user
        );
      },
      (err) => {
        console.log('err login status --> ', err);
      }
    )
  );
  }

  updateUser(user: any) {
    return this.http.post( this.baseUrl + '/api/update-user', user, {withCredentials: true});
  }

  logOut() {
    console.log('before request for logout');
    return(
      this.http.delete(
      this.baseUrl + '/api/logout',
      { withCredentials: true }
    )
    .do(
      () => {
        this.loginStatusSubject.next(
          { isLoggedIn: false }
        );
      }
    )
  );
  }

}
