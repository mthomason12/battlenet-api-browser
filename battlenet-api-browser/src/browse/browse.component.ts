import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { dataStruct } from '../userdata/userdata.service';

@Component({
  selector: 'app-browse',
  imports: [ MatCardModule ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent {
  @Input() data?: dataStruct;
}
