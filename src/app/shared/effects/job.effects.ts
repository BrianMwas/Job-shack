import { Injectable } from '@angular/core';
import { JobService } from 'src/app/jobs/job.service';
import { createEffect, Actions, ofType } from "@ngrx/effects";
import * as featureActions from "../actions/joblist.actions"
import { concatMap, tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class JobEffects {

    loadJobs$ = createEffect(() => this.actions$.pipe(
        ofType(featureActions.AllJobsLoading),
        concatMap(() => this.jobService.getJobs()
            .pipe(
                map(res => featureActions.AllJobs({ payload: res.data })),
                catchError(error => of(featureActions.AllJobsFailure({ payload: error})))
            )
        )
    ))

    constructor (private jobService: JobService, private actions$ : Actions) {}
}