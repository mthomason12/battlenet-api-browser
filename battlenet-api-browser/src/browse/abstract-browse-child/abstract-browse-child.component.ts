import { Component, inject, OnInit } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { ApiclientService } from '../../apiclient/apiclient.service';
import { dataStruct } from '../../model/datastructs';

@Component({
  selector: 'app-abstract-browse-child',
  imports: [],
  templateUrl: './abstract-browse-child.component.html',
  styleUrl: './abstract-browse-child.component.scss'
})
export class AbstractBrowseChildComponent<T extends dataStruct> implements OnInit{

  protected apiClient: ApiclientService = inject(ApiclientService);

  constructor(protected data: UserdataService)
  {
  }

  ngOnInit(): void {
    this.preinit();
    this.currentData().checkLoaded(this.apiClient);
    this.data.setCurrent(this.currentData());
  }

  //things to do just before oninit
  preinit()
  {
  }

  currentData(): T
  {
    return this.data.getCurrent() as T;
  }

  
}
