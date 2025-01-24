import { Component } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { dataDoc, dataDocDetailsCollection } from '../../model/datastructs';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-abstract-browse-detail',
  imports: [],
  templateUrl: './abstract-browse-detail.component.html',
  styleUrl: './abstract-browse-detail.component.scss'
})
export abstract class abstractBrowseDetailComponent <T1 extends dataDocDetailsCollection<T1,T2>, T2 extends dataDoc> extends AbstractBrowseChildComponent<T2>{
  datadoc?: T2;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  //things to do just before oninit
  override preinit()
  {
    super.preinit();
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.currentMaster().details.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!; 
  }

  /**
   * Override in descendant classes to return the master for this detail document
   * e.g. return this.data.data.apiData.wowpublic.creatureFamiliesData
   */
  abstract currentMaster(): T1

  override currentData(): T2
  {
    return this.datadoc!;
  }

  
}
