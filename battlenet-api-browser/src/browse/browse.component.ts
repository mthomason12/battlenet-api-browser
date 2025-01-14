import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { dataStruct } from '../userdata/userdata.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule, MatButtonModule ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent {
  @Input() data?: dataStruct;

  reloadData()
  {
    
  }
}
