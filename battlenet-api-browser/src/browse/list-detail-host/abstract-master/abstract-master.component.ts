import { ChangeDetectorRef, Component, EventEmitter, inject, Input } from '@angular/core';
import { apiIndexDoc, IIndexItem, IMasterDetail } from '../../../model/datastructs';
import { ApiclientService } from '../../../services/apiclient.service';

@Component({
  selector: 'app-abstract-master',
  imports: [],
  templateUrl: './abstract-master.component.html',
  styleUrl: './abstract-master.component.scss'
})
export abstract class AbstractMasterComponent<T extends IMasterDetail> {
  
  ref = inject(ChangeDetectorRef);
  api = inject(ApiclientService);

  index?: apiIndexDoc;
  indexItems?: IIndexItem[];

  private _rec?: T;

  @Input({required: true})
  get data(): T | undefined {
    return this._rec!;
  }

  set data(value: T) {
    this._rec = value;
    this.dataSet();
  }

  // reference to an event emitter to emit to when an item is clicked
  @Input({required: true})
  clicked?: EventEmitter<any>;
  

  click(item: any)
  {
    this.clicked!.emit(item);
  }

  /** called when data input is set */
  dataSet()
  {
    this.data?.getIndex(this.api).then((idx)=>{
      this.index = idx;
      this.indexItems = this.data?.getIndexItems(idx!);
      this.processData();
      this.ref.detectChanges();
    });
  }

  /** Called when data is ready for any additional processing */
  processData()
  {
    //do nothing by default
  }



}
