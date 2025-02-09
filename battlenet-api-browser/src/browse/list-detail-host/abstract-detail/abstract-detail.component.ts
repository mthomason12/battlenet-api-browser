import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { IApiDataDoc, IMasterDetail } from '../../../model/datastructs';

@Component({
  selector: 'app-abstract-detail',
  imports: [],
  templateUrl: './abstract-detail.component.html',
  styleUrl: './abstract-detail.component.scss'
})
export abstract class AbstractDetailComponent<T extends IApiDataDoc>
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

  /** called when data input is set */
  dataSet()
  {
  }

}
