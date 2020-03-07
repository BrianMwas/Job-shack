
import { Job } from '../shared/models/job';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map, tap, shareReplay, retryWhen, delay } from 'rxjs/operators';
import { NbAuthService } from '@nebular/auth';


interface JobResults {
  data: Job[],
  success: boolean
}

const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'token'
  })
}
@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = "http://localhost:9000/api/v1/";

  constructor(private http: HttpClient, private authService: NbAuthService) {
    this.authService.getToken()
    .subscribe(res=> {
      httpOptions.headers = httpOptions.headers.set('authorization', res['token'])
    })
   }

  getJobById(id: String): Observable<any> {
    let jobUrl = `${this.baseUrl}jobs/${id}`;
    return this.http.get<Job>(jobUrl).pipe(
      map(res =>  res['data']),
      tap(res => console.log("res", res)),
      catchError(this.handleError<Job>('getJob'))
    )
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      this.log(`${operation} failed: ${error}`)
      return of(result as T)
    }
  }


  private log(message: string) {
    console.log(message)
  }

  getJobs() {
    let jobsUrl = `${this.baseUrl}jobs`;
    return this.http.get<JobResults>(jobsUrl)
  }


  getJobsByCategory(country, type, industry) {
    let url = `${this.baseUrl}search-jobs?country=${country}&type=${type}&industry=${industry}`;

    return this.http.get(url).pipe(
      map(res => res['data']),
      catchError(err => {
        console.log(err)
        return throwError(err)
      })
    )
  }


  search(query: string): Observable<Job[]> {
    let searchString = `${this.baseUrl}search=${query}`;
    return this.http.get<Job[]>(searchString)
  }


  postJob(companyId: string, job: Job): Observable<Job> {
    let url = `${this.baseUrl}company/${companyId}/new-job`
    return this.http.post<Job>(url, job, httpOptions).pipe(
      catchError(this.handleError('addJob', job))
    )
  }

  updateJob(companyId: string, jobId: string, job: Job): Observable<Job> {
    let url = `${this.baseUrl}company/${companyId}/job/${jobId}/update`;
    return this.http.patch<Job>(url, job, httpOptions)
  }
}
