import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct, dataDoc } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, EventType } from '@angular/router';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule, CommonModule, RouterOutlet ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit, OnDestroy {

  apiCli?: ApiclientService;
  

  constructor(private apiClient: ApiclientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  {
    this.apiCli = apiClient;
    
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event.type == EventType.NavigationEnd)
      {   
        this.cdr.detectChanges();  
      }
    });

    this.data.dataLoadedEmitter.subscribe(()=>{
      //console.log("Data Load Event");
      //console.log(this.router.url);
      var currenturl = this.router.url;
      this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
        this.router.navigateByUrl(currenturl, {onSameUrlNavigation: 'reload'}).then (()=>{
          //console.dir(this.currentDataDoc());      
          this.cdr.detectChanges();               
        });
      });
    });

    this.data.dataChangedEmitter.subscribe(()=>{
      //console.log("Data Changed Event");
      this.cdr.detectChanges(); 
    });
  }
  ngOnDestroy(): void {

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
