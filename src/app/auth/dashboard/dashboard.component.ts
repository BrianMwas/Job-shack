import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { UserService } from './../user.service';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { CompanyService } from '../company.service';
import { FilestackService } from '@filestack/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userInfo: Observable<object>;

  @Output()
  user: Observable<User>;
  file: any;

	fileStackApiKey: string
	profileChanged: boolean = false;


	@Output()
	userProfile = {};
	constructor(private route: ActivatedRoute, protected companyService: CompanyService, private fileStackService: FilestackService, protected router: Router, private userService: UserService, private authService: NbAuthService) {
	}

	pForm: FormGroup = new FormGroup({
		username: new FormControl('', Validators.required),
		telephone: new FormControl('', Validators.required)
	})

	ngOnInit() {
		this.checkProfile(this.route.snapshot.data['userData']);

		this.authService.onTokenChange()
			.subscribe((token: NbAuthJWTToken) => {
				if (token.isValid()) {
					this.userInfo = token.getPayload();
				}
			})

		this.userService.getAuthUser(this.userInfo['userId'])
			.subscribe(userData => {
          this.user = userData

        	}
		)

    this.fileStackApiKey = "10ea8b7a49a4db2d14212cd2bfa1d52e85f69f5a";

    this.fileStackService.init('10ea8b7a49a4db2d14212cd2bfa1d52e85f69f5a');

		this.populateProfile()
		this.pForm.statusChanges.subscribe(x => {
			if(x == 'VALID') {
				this.profileChanged = true
			} else {
				this.profileChanged = false
			}
		})
	}



  // ngOnInit() {
  //   this.filestackService.init('YOUR_API_KEY');
  // }
  fileChanged(e) {
    this.file = e.target.files[0];
  }
  uploadFile() {
    this.fileStackService.upload(this.file)
      .subscribe(res => console.log(res));
  }

	checkProfile(data) {
		if(data == undefined) {
			this.router.navigate(['/create-profile'])
		} else {
			this.userProfile = data['data']
		}
	}

	updateProfile() {
		console.log("udp", this.pForm.value)
		console.log("user info", this.userInfo)

		this.userService.updateUserProfile(this.userInfo['userId'], this.pForm.value).subscribe(
			(changedData) => {
				console.log("changed..", changedData)
			}
		)
	}


	onUploadSuccess(res: object) {
		console.log('###uploadSuccess', res);
	}

	onUploadError(err: any) {
		console.log('###uploadError', err);
	}

	populateProfile() {
		this.pForm.get('username').setValue(this.userProfile['username']);
		this.pForm.get('telephone').setValue(this.userProfile['telephone'])
	}
}
