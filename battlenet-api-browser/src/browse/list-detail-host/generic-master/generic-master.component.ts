import { Component } from '@angular/core';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListDataItemComponent } from '../../../components/list-data-item/list-data-item.component';
import { IMasterDetail } from '../../../model/dbdatastructs';


@Component({
  selector: 'app-generic-master',
  imports: [ 
    ScrollingModule,
    ListDataItemComponent 
  ],
  templateUrl: './generic-master.component.html',
  styleUrl: './generic-master.component.scss',
  inputs: ['data','clicked']
})
export class GenericMasterComponent extends AbstractMasterComponent<IMasterDetail> {


}
