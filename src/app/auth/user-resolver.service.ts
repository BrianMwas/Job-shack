import { NbAuthService } from '@nebular/auth';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Profile } from '../shared/models/profile';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<Profile> {

  constructor(private userService: UserService, private authService: NbAuthService, private router: Router) { }
  userId: string

  resolve(): Observable<any> {
    this.authService.onTokenChange()
    .subscribe(token => {
      this.userId = token.getPayload()['userId']
    })

    return this.userService.getUserProfile(this.userId)
  }
}
