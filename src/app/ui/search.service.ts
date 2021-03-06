import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = "http://localhost:9000/api/v1/";

  constructor(private httpService: HttpClient) { }

  getResultBySearchTerm(term) {
    let url = `${this.baseUrl}search-jobs?term=${term}`;

    return this.httpService.get(url).pipe(
      tap(res => {
        console.log("res search", res)
      })
    )
  }

  getResultsFromJobProperties(params: Array<string>) {
    let url = `${this.baseUrl}search-jobs`;
    if(params) {
      url = `${url}?country=${params[0]}&type=${params[2]}&industry=${params[1]}`
    }
    return this.httpService.get(url).pipe(
      tap(res => console.log("data from job properties", res))
    )
  }
}
