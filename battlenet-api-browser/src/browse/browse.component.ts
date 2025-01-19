import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct, dataDoc } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, EventType } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule, CommonModule, RouterOutlet ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit, OnDestroy {

  apiCli?: ApiclientService;
  navigationEndSubscription?: Subscription;
  dataChangedSubscription?: Subscription;
  

  constructor(private apiClient: ApiclientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  {
    this.apiCli = apiClient;
    
  }

  ngOnInit(): void {
    this.navigationEndSubscription = this.router.events.subscribe((event: Event) => {
      if (event.type == EventType.NavigationEnd)
      {   
        this.cdr.detectChanges();  
      }
    });

    this.dataChangedSubscription = this.data.dataChangedEmitter.subscribe(()=>{
      this.cdr.detectChanges(); 
    });
  }

  ngOnDestroy(): void {
    this.navigationEndSubscription?.unsubscribe;
    this.dataChangedSubscription?.unsubscribe;
  }

  reload()
  {
    if (this.data !== undefined)
    {
      this.data.getCurrent()?.reload(this.apiClient);
    }
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }

  currentDataDoc(): dataDoc | undefined
  {
    return this.data.getCurrent() as dataDoc;
  }

}
