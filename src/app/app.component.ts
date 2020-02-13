import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { GithubService } from './github.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Form
  searchForm = new FormGroup({
    query: new FormControl('')
  })

  // Get loading stream from service
  loading$: Observable<boolean> = this.gs.loading$; 

  // Deconstruct form to just take the query
  // Search on changes
  searchResults$ = this.searchForm.valueChanges.pipe(
    switchMap(({query}) => this.gs.get(query))
  );

  constructor(private gs: GithubService) { }

}
