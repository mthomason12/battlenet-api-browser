import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { dataDoc, dataDocCollection } from '../../../model/datastructs';

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

  @Output('clicked') clickedEvent = new EventEmitter<string | number>();
}
