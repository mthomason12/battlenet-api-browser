import { ChangeDetectorRef, Component, EventEmitter, inject, Input } from '@angular/core';
import { dataDocCollection } from '../../../model/datastructs';

@Component({
  selector: 'app-abstract-master',
  imports: [],
  templateUrl: './abstract-master.component.html',
  styleUrl: './abstract-master.component.scss'
})
export abstract class AbstractMasterComponent<T extends dataDocCollection<any>> {
  
  ref = inject(ChangeDetectorRef);

  private _rec?: T;

  @Input({required: true})
  get data(): T | undefined {
    return this._rec!;
  }

  set data(value: T) {
    this._rec = value;
    this.ref.detectChanges();
  }

  // reference to an event emitter to emit to when an item is clicked
  @Input({required: true})
  clicked?: EventEmitter<any>;
  

  click(item: any)
  {
    this.clicked!.emit(item);
  }

}
