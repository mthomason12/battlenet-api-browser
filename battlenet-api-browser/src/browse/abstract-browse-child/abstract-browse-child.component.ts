import { Component } from '@angular/core';
import { dataStruct, UserdataService } from '../../userdata/userdata.service';

@Component({
  selector: 'app-abstract-browse-child',
  imports: [],
  templateUrl: './abstract-browse-child.component.html',
  styleUrl: './abstract-browse-child.component.scss'
})
export class AbstractBrowseChildComponent {

  constructor(protected data: UserdataService)
  {
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }
}
