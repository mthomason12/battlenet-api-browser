import { Component } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { dataStruct } from '../../userdata/datastructs';

@Component({
  selector: 'app-abstract-browse-child',
  imports: [],
  templateUrl: './abstract-browse-child.component.html',
  styleUrl: './abstract-browse-child.component.scss'
})
export class AbstractBrowseChildComponent {

  constructor(protected data: UserdataService)
  {
    this.data.setCurrent(this.currentData()!);
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }
}
