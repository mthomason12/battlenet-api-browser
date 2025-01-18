import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct, dataDoc } from '../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, Event, EventType } from '@angular/router';
import { AbstractBrowseChildComponent } from './abstract-browse-child/abstract-browse-child.component';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule, CommonModule, RouterOutlet ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent {

  apiCli?: ApiclientService;
  currentChild?: AbstractBrowseChildComponent;
  title: string="";

  constructor(private apiClient: ApiclientService, protected data: UserdataService, private cdr: ChangeDetectorRef, private router: Router)
  {
    this.apiCli = apiClient;
    router.events.subscribe((event: Event) => {
      if (event.type == EventType.NavigationEnd)
      {
        this.title = this.data.getCurrent()?.getName() ?? "";
        this.data.getCurrent()?.checkLoaded(this.apiCli!);    
        this.cdr.detectChanges();  
      }
    });
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
