import { Component, OnInit } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { dataStruct } from '../../model/datastructs';

@Component({
  selector: 'app-abstract-browse-child',
  imports: [],
  templateUrl: './abstract-browse-child.component.html',
  styleUrl: './abstract-browse-child.component.scss'
})
export class AbstractBrowseChildComponent implements OnInit{

  constructor(protected data: UserdataService)
  {
  }

  ngOnInit(): void {
    this.preinit();
    this.data.setCurrent(this.currentData()!);
  }

  //things to do just before oninit
  preinit()
  {
  }

  currentData(): dataStruct | undefined
  {
    return this.data.getCurrent();
  }

  
}
