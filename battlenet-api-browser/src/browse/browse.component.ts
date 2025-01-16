import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { dataStruct, UserdataService } from '../userdata/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule, CommonModule, RouterOutlet ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent {

  apiCli?: ApiclientService;

  constructor(private apiClient: ApiclientService, protected data: UserdataService)
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
