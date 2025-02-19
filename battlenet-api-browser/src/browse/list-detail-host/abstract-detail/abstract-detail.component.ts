import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { IApiDataDoc } from '../../../model/datastructs';
import { IMasterDetail } from '../../../model/dbdatastructs';
import { apiClientService } from '../../../services/apiclient.service';
import { UserdataService } from '../../../services/userdata.service';
import { dbDataLookups } from '../../../model/dbdatalookups';

@Component({
  selector: 'app-abstract-detail',
  imports: [],
  templateUrl: './abstract-detail.component.html',
  styleUrl: './abstract-detail.component.scss'
})
export abstract class AbstractDetailComponent<T extends IApiDataDoc> implements OnInit
{
  ref = inject(ChangeDetectorRef);
  protected api = inject(apiClientService);
  protected userData = inject(UserdataService);
  protected apiData = this.userData.data.apiData;
  protected lookups: dbDataLookups = new dbDataLookups(this.api);

  private _rec?: T;
  private _master?: IMasterDetail;  

  @Input({required: true})
  get data(): T | undefined {
    return this._rec!;
  }

  set data(value: T) {
    this._rec = value;
    this.dataSet();
    this.ref.detectChanges();
  }

  @Input({required: true})
  get master(): IMasterDetail | undefined {
    return this._master!;
  }

  set master(value: IMasterDetail) {
    this._master = value;
    this.dataSet();
    this.ref.detectChanges();
  }  

  /** 
   * called when data input is set 
   */
  dataSet()
  {
  }

  /**
   *  Override on descendants if needed 
   */
  ngOnInit(): void {
  }


}
