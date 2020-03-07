import { JobService } from './job.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JobDetailResolverService implements Resolve<any> {

  constructor(private jobService: JobService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.jobService.getJobById(route.paramMap.get('id'))
  }
}
