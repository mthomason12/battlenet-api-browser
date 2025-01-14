import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { dataStruct } from '../userdata/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule, CommonModule ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent {
  @Input() data?: dataStruct;

  apiCli?: ApiclientService;

  constructor(private apiClient: ApiclientService)
  {
    this.apiCli = apiClient;
  }

  reload()
  {
    if (this.data !== undefined)
    {
      this.data.reload(this.apiClient);
    }
  }
}
