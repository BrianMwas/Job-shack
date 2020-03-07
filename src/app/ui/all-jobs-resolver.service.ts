import { Resolve, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { JobService } from '../jobs/job.service';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/models/states/app.state.model';
import { AllJobsLoading } from '../shared/actions/joblist.actions';

@Injectable({
  providedIn: 'root'
})
export class AllJobsResolverService implements Resolve<any> {

  constructor(private jobService: JobService, private store: Store<AppState>) { }

  resolve() {
    this.store.dispatch(AllJobsLoading())
    return this.jobService.getJobs().pipe(
      tap(res => console.log("router", res.data)),
      map(res => res.data)
    )
  }
}
