import { NbAuthService } from '@nebular/auth';
import { Job } from '../../shared/models/job';
import {  ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
   } from '@angular/core';
import { ApplicationService } from 'src/app/applications/application.service';
import { NbAccessChecker } from '@nebular/security';
import { NbToastrService } from '@nebular/theme';
import { UserService } from 'src/app/auth/user.service';
import { Application } from 'src/app/shared/models/application';
import { User } from 'src/app/shared/models/user';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.scss']
})
export class JobdetailComponent implements OnInit {

  loggedIn: Observable<Boolean>
  job: Job;
  userId: string;
  jobApplied: boolean = false

  constructor(
    private route: ActivatedRoute,
    private authService: NbAuthService,
    private router: Router,
    private applicationService: ApplicationService,
    private userService: UserService,
    public accessChecker: NbAccessChecker,
    public toastrService: NbToastrService
  ) { }


  ngOnInit() {
    // let id = this.route.snapshot.paramMap.get('id')
    // this.service.getJobById(id).subscribe(job => this.job$ = job)
    this.authService.isAuthenticated().subscribe(res => {
      this.loggedIn = of(res)
    })

    this.authService.getToken()
    .subscribe(res => {
      this.userId = res.getPayload()['userId']
    })

    this.job = new Job(this.route.snapshot.data['singleJob'])

    this.logJob()

    this.loggedIn.subscribe(res => {
      if (res) {
        this.userService.getAuthUser(this.userId)
        .subscribe(result => {
          
          if(this.loggedIn) {
            if(result['applications'].length > 0) {
              let user = new User(result);
              console.log("user", user)
              for(var i = 0; i < user.applications.length; i++) {
                // console.log("apply", this.job.id === user.applications[i]['job']['id'])
                if(this.job.id === user.applications[i]['job']['id']) {
                  this.jobApplied = true
                  break;
                } else {
                  this.jobApplied = false
                }
              }
            }
          }
        })
      }
    })
  }

  logJob() {
    // this.loggedIn.subscribe(res => console.log("loggedIn", res));
    console.log("job by id", this.job)
  }


  applyJob() {
    this.loggedIn.subscribe(res => {
      if(res) {
        this.applicationService.createApplication(this.job.id)
        .subscribe(
          (res) => {
            this.toastrService.info(res['message'], 'Application', { preventDuplicates: true, destroyByClick: true})
          },
          (error) => {
            console.log("error", error)
          },
          () => {
            console.log("done")
            this.toastrService.success("Application done", "Application", { preventDuplicates: true, destroyByClick: true})
            this.router.navigate(['/'])
          }
        )
      }
    });

  }


  gotoLogin() {
    this.router.navigate(['/auth/login'])
  }
}
