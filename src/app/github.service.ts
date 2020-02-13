import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, delay, catchError } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';

const URL = 'https://api.github.com/search/users?q='

interface IResults {
  total_count: number,
  incomplete_results: boolean,
  items: []
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly loading = new Subject<boolean>();
  get loading$(): Observable<boolean> {
    return this.loading.pipe(tap(console.log));
  }


  constructor(private http: HttpClient) {}

  get(q: string) {
    return this.http.get<IResults>(URL + q).pipe(
      tap(() => this.loading.next(true)),
      delay(1000),
      map((res) => {
        this.loading.next(false);
        return res.items;
      }),
      catchError((err) => {
        console.log(err);
        this.loading.next(false);
        return of([{ login: "Error from server" }]);
      })
    )
  }
}
