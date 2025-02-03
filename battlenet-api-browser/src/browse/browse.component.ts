import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule, MatCardFooter } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UserdataService } from '../services/userdata.service';
import { apiDataDoc, dataDoc, dataDocDetailsCollection, dbData, IMasterDetail } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../services/apiclient.service';
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

  readonly dialog = inject(MatDialog);
  readonly jobQueue = inject(JobQueueService);

  displayData?: apiDataDoc;
  dataObject?: IMasterDetail;
  lastUpdate?: Date;

  name?: string;

  constructor(protected apiClient: ApiclientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  { 
  }

  ngOnInit(): void {
    this.update();
    this.navigationEndSubscription = this.router.events.subscribe((event: Event) => {
      if (event.type == EventType.NavigationEnd)
      {   
        this.cdr.detectChanges();  
      }
    });

    this.dataChangedSubscription = this.data.dataChangedEmitter.subscribe(({master, rec})=>{
      this.dataObject = master;      
      this.displayData = rec;
      this.update();
    });
  }

  ngOnDestroy(): void {
    this.navigationEndSubscription?.unsubscribe;
    this.dataChangedSubscription?.unsubscribe;
  }

  update() {
    if (this.displayData !== undefined)
    {
      this.name = this.dataObject!.getRecName(this.displayData);
      this.lastUpdate = new Date(this.displayData!.lastUpdate!);
    }
    else
    {
      this.name = this.dataObject?.getName();
      var idx = this.dataObject?.getIndex(this.apiClient).then((index)=>{
        this.lastUpdate = new Date(index?.lastUpdate!);
      })       
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

  canGetAll(): boolean
  {
    return (this.currentData() instanceof dataDocDetailsCollection || this.currentData() instanceof dbData);
  }

  getAll()
  {
    if (this.canGetAll())
    {
      (this.currentData() as IMasterDetail).getAllRecs(this.apiClient, this.jobQueue);
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
