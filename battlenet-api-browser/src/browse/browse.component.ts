import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule, MatCardFooter } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogClose, MatDialogContent, MatDialogActions, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UserdataService } from '../services/userdata.service';
import { dataStruct, dataDoc, dataDocDetailsCollection } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../services/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, EventType } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { JobQueueService } from '../services/jobqueue.service';

@Component({
  selector: 'app-browse',
  imports: [ 
    MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardFooter,
    CommonModule, RouterOutlet, BreadcrumbComponent 
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit, OnDestroy {

  navigationEndSubscription?: Subscription;
  dataChangedSubscription?: Subscription;

  readonly dialog = inject(MatDialog);
  readonly jobQueue = inject(JobQueueService);

  constructor(protected apiClient: ApiclientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  { 
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
      this.data.refreshRequestEmitter.emit();
    }
  }

  debug()
  {
    this.dialog.open(BrowseDebugDialog, {
      width: "90%",
      data: { current: this.data.getCurrent() }
    });
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }

  currentDataDoc(): dataDoc | undefined
  {
    return this.currentData() as dataDoc;
  }

  canGetAll(): boolean
  {
    return (this.currentData() instanceof dataDocDetailsCollection);
  }

  getAll()
  {
    if (this.currentData() instanceof dataDocDetailsCollection )
    {
      (this.currentData() as dataDocDetailsCollection<any,any>).getAll(this.apiClient, this.jobQueue);
    }
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
