import { NbAuthService } from '@nebular/auth';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { retry, catchError, map} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'authorization': 'token'
  })
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "http://localhost:9000/api/v1/";
  token: any;

  

  constructor(private http: HttpClient, private authService: NbAuthService) { 
    this.authService.getToken()
      .subscribe(res => {
        httpOptions.headers = httpOptions.headers.set("authorization", res['token'])
      })
   }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${JSON.stringify(error)}`)
      return of(result as T)
    }
  }

  private log(message: string) {
    console.log(message)
  }


  getUserProfile(userId) {
  	let url = `${this.baseUrl}user/${userId}/profile`;
  	return this.http.get(url, httpOptions).pipe(
  		catchError(
  			this.handleError('User profile')
  			)
  		)
    }
    

  getAuthUser(userId) {
    let url = `${this.baseUrl}users/${userId}`;

    return this.http.get(url, httpOptions).pipe(
      map(res => res['data']),
      catchError(
        this.handleError('getAuthUser')
      )
    )
  }

  addUserProfile(userId, profile) {
    let url = `${this.baseUrl}user/new/${userId}/create-profile`;

    console.log("url", url)

    console.log("profile", profile)
    return this.http.post(url, profile, httpOptions)
    // return this.http.post(url, profile, httpOptions)
    .pipe(
        map(res => { 
          res['data']
          console.log("res", res)
        }),
        catchError(
          this.handleError('postProfile'))
      )
  }

  updateUserProfile(userId, data) {
    let url = `${this.baseUrl}user/${userId}/update-profile`;

    return this.http.patch(url, data, httpOptions).pipe(
      map(data => data['data']),
      catchError(this.handleError('profile update failed'))
    )
  }
	
}
