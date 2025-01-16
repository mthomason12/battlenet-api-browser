import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct } from '../userdata/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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

  constructor(private apiClient: ApiclientService, protected data: UserdataService, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef)
  {
    this.apiCli = apiClient;
  }

  reload()
  {
    if (this.data !== undefined)
    {
      this.data.getCurrent()?.reload(this.apiClient);
    }
  }

  activateEvent(child: AbstractBrowseChildComponent)
  {
    this.title = child.currentData()?.name() ?? "";
    this.cdr.detectChanges();    
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }

  dataIs(type: string): boolean
  {
    if (this.data.getCurrent() instanceof Object)
    {
      //console.log("Type is "+this.data.constructor.name);
      if (this.data.getCurrent()!.constructor.name === type)
      {
        return true;
      }
    }
    return false;    
  }
}
