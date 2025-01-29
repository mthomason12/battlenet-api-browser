import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { dataDetailDoc } from '../../../model/datastructs';

@Component({
  selector: 'app-abstract-detail',
  imports: [],
  templateUrl: './abstract-detail.component.html',
  styleUrl: './abstract-detail.component.scss'
})
export abstract class AbstractDetailComponent<T extends dataDetailDoc>
{
  ref = inject(ChangeDetectorRef);

  private _rec?: T;

  @Input({required: true})
  get data(): T | undefined {
    return this._rec!;
  }

  set data(value: T) {
    this._rec = value;
    console.dir(value);
    this.ref.detectChanges();
  }


}
