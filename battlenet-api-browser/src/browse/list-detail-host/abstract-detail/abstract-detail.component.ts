import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { IApiDataDoc } from '../../../model/datastructs';
import { IMasterDetail } from '../../../model/dbdatastructs';

@Component({
  selector: 'app-abstract-detail',
  imports: [],
  templateUrl: './abstract-detail.component.html',
  styleUrl: './abstract-detail.component.scss'
})
export abstract class AbstractDetailComponent<T extends IApiDataDoc> implements OnInit
{

  ref = inject(ChangeDetectorRef);

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
