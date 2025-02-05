import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule, MatCardFooter } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UserdataService } from '../services/userdata.service';
import { apiDataDoc, dataDoc, dbData, IMasterDetail, INamedItem } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { apiClientService } from '../services/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, EventType } from '@angular/router';
import { Subscription } from 'rxjs';
import { JobQueueService } from '../services/jobqueue.service';

@Component({
  selector: 'app-browse',
  imports: [ 
    MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardFooter,
    CommonModule, RouterOutlet
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit, OnDestroy {

  navigationEndSubscription?: Subscription;
  dataChangedSubscription?: Subscription;
  dataRefreshedSubscription?: Subscription;

  readonly dialog = inject(MatDialog);
  readonly jobQueue = inject(JobQueueService);

  displayData?: apiDataDoc;
  dataObject?: INamedItem;
  lastUpdate?: Date;
  canGetAll: boolean = false;

  name?: string;

  constructor(protected apiClient: apiClientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  { 
  }

  ngOnInit(): void {
    this.update();

    //catch navigation ended events
    this.navigationEndSubscription = this.router.events.subscribe((event: Event) => {
      if (event.type == EventType.NavigationEnd)
      {   
        this.cdr.detectChanges();  
      }
    });

    //catch data changed events (current data object reference has changed)
    this.dataChangedSubscription = this.data.dataChangedEmitter.subscribe(({master, rec})=>{
      this.dataObject = master;      
      this.displayData = rec;
      this.update();
    });

    //catch data refreshed events (current data object contents but not reference have changed)
    this.dataRefreshedSubscription= this.data.dataRefreshedEmitter.subscribe(()=>{
      this.update();
    })
  }

  ngOnDestroy(): void {
    this.navigationEndSubscription?.unsubscribe;
    this.dataChangedSubscription?.unsubscribe;
  }

  dataObjectIsLive(): boolean
  {
    return (this.dataObject instanceof dbData);
  }

  update() {
    if (this.displayData !== undefined)
    {
      //we're looking at the detail
      if (this.dataObjectIsLive())
        this.name = (this.dataObject as IMasterDetail).getRecName(this.displayData);
      this.lastUpdate = new Date(this.displayData!.lastUpdate!);
      this.canGetAll = false;
    }
    else
    {
      //we're looking at the master
      this.name = this.dataObject?.getName();
      if (this.dataObjectIsLive())
      {
        (this.dataObject as IMasterDetail).getIndex(this.apiClient).then((index)=>{
          this.lastUpdate = new Date(index?.lastUpdate!);
        })      
      } 
      this.canGetAll = this.dataObjectIsLive();
    }
    
  }

  reload()
  {
    if (this.data !== undefined)
    {
      this.data.refreshRequestEmitter.emit();
    }
  }

  debug()
  {
    this.dialog.open(BrowseDebugDialog, {
      width: "90%"
    });
  }

  currentData(): apiDataDoc | undefined
  {
    return this.data.getCurrent();
  }

  getAll()
  {
    if (this.canGetAll)
    {
      (this.dataObject as IMasterDetail).getAllRecs(this.apiClient, this.jobQueue);
    }
  }


  hasData(): boolean {
    if (this.currentData() instanceof dataDoc)
    {
      return (this.currentData() as dataDoc).hasData();
    }
    return true;
  }

}

@Component({
  selector: 'browse-debug-dialog',
  templateUrl: 'browse-debug-dialog.html',
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, CommonModule],
})
export class BrowseDebugDialog {
  data = inject(MAT_DIALOG_DATA);
}
