import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GithubService } from './github.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of, iif, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchForm = new FormGroup({
    query: new FormControl('')
  })

  loading$: Observable<boolean> = this.gs.loading$; 

  searchResults$ = this.searchForm.valueChanges.pipe(
    debounceTime(100),
    switchMap(({query}) => 
      iif(() => query.length > 3,
        this.gs.get(query),
        of(null))
    )
  );

  constructor(private gs: GithubService) { }
}
