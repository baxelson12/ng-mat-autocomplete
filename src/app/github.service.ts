import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, delay, catchError } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';

const URL = 'https://api.github.com/search/users?q='

// The layout of data from Github
interface IResults {
  total_count: number,
  incomplete_results: boolean,
  items: []
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  // Loading stream
  private readonly loading = new Subject<boolean>();
  get loading$(): Observable<boolean> {
    return this.loading;
  }


  constructor(private http: HttpClient) {}

  get(q: string) {
    // Expect results to be in form of IResults
    return this.http.get<IResults>(URL + q).pipe(
      // Set loading to true when request begins
      tap(() => this.loading.next(true)),
      // Simulate server
      delay(1000),
      // If we get to this point, we know we got the data,
      // set loading to false, return only the items
      map((res) => {
        this.loading.next(false);
        return res.items;
      }),
      // Catch any errors
      catchError((err) => {
        console.log(err);
        this.loading.next(false);
        // Just remapping the data to show the error
        // There are better ways of doing this
        return of([{ login: "Error from server" }]);
      })
    )
  }
}
