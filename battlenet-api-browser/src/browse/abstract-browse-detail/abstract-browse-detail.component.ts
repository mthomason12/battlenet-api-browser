import { Component } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { dataDetailDoc, dataDoc, dataDocDetailsCollection } from '../../model/datastructs';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { ActivatedRoute } from '@angular/router';
import { ApiclientService } from '../../apiclient/apiclient.service';

@Component({
  selector: 'app-abstract-browse-detail',
  imports: [],
  templateUrl: './abstract-browse-detail.component.html',
  styleUrl: './abstract-browse-detail.component.scss'
})
export abstract class AbstractBrowseDetailComponent <T1 extends dataDocDetailsCollection<T2,T3>, T2 extends dataDoc, T3 extends dataDetailDoc> extends AbstractBrowseChildComponent<T3>{
  datadoc?: T3;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService, protected override apiClient: ApiclientService)
  {
    super(data);
  }

  //things to do just before oninit
  override preinit()
  {
    super.preinit();
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.currentMaster().ensureDetailEntry(this.apiClient, Number.parseInt(this.id));
  }

  /**
   * Override in descendant classes to return the master for this detail document
   * e.g. return this.data.data.apiData.wowpublic.creatureFamiliesData
   */
  abstract currentMaster(): T1

  override currentData(): T3
  {
    return this.datadoc!;
  }

  
}
