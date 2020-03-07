import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { SEOService } from '../../shared/services/seo.service';
import { JobService } from "../../jobs/job.service";
import {Job} from "../../shared/models/job";
import { Component, OnInit, Output } from '@angular/core';
import * as country from "../../../assets/JSON/country.json";
import * as industry from "../../../assets/JSON/industry.json";
import * as jobtype from "../../../assets/JSON/job-type.json"


import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, map, mergeMap } from 'rxjs/operators';
import { query } from '@angular/animations';
import { FilestackService } from '@filestack/angular';
import { AppState } from 'src/app/shared/models/app.state.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobState } from 'src/app/shared/reducers/jobs.reducer';
import { AllJobs, AllJobsLoading } from 'src/app/shared/actions/joblist.actions';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class homeComponent implements OnInit {

  @Output()
  initJobs: Job[] = [];

  @Output()
  allJobs: Observable<Job[]>;

  countries: any = (country as any).default;
  industries: any = (industry as any).default;
  jobtypes: any = (jobtype as any).default;

  categories: FormGroup = new FormGroup({
    country: new FormControl(''),
    industry: new FormControl(''),
    jobtype: new FormControl('')
  })

  apikey: string
  file: any

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  })



  constructor( private router: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>,  private _seoService: SEOService, private fileStackService: FilestackService ) { }


  ngOnInit() {
    this.logJobs(this.store.select(store => store.jobs))    
    // this.store.dispatch(AllJobsLoading());

    this.fileStackService.init('YOUR_API_KEY');
    // this.getJobs(this.activatedRoute.snapshot.data['jobs'])
    // this.initJobs = this.activatedRoute.snapshot.data['jobs']
  }

  // getJobs(arr?: any) {
  //   if(arr) {
  //     for (let i = 0; i < arr.length; i++) {
  //       this.initJobs.push(new Job(arr[i]));
  //     }
      
  //   }
  // }

  logJobs(jobs: Observable<JobState[]>) {
    jobs.subscribe(log => this.allJobs = log['jobs'])
  }

  changeCountry(e) {
    this.categories.get('country').setValue(e.target.value);
  }

  changeIndustry(e) {
    this.categories.get('industry').setValue(e.target.value);
  }

  changeJobType(e) {
    this.categories.get('jobtype').setValue(e.target.value);

  }

  onSubmit() {
    if(this.categories.invalid) {
      return;
    }

    let searchObj = Object.values(this.categories.value)

    let s = `country=${searchObj[0] ||  ""}&industry=${searchObj[1] || ""}&type=${searchObj[2] || ""}`
    console.log(s)
    this.categories.reset()
  }


  subscribe() {
    if(this.emailForm.valid)
      console.log("subscribe", this.emailForm.value)
      this.emailForm.reset()
  }

  gotoResumeIO() {
    this.router.navigate(['https://resume.io'])
  }
}

