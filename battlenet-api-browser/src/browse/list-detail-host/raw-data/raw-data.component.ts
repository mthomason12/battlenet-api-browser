import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { jsonIgnoreReplacer } from 'json-ignore';
import { NgxJsonViewerComponent } from '../../../components/ext/ngx-json-viewer/ngx-json-viewer.component';

@Component({
  selector: 'app-raw-data',
  imports: [ CommonModule, NgxJsonViewerComponent ],
  templateUrl: './raw-data.component.html',
  styleUrl: './raw-data.component.scss'
})
export class RawDataComponent {

  ref = inject(ChangeDetectorRef);

  private _rec?: any;

  @Input({required: true})
  get data(): any | undefined {
    return this._rec!;
  }

  set data(value: any) {
    this._rec = value;
    this.ref.detectChanges();
  }

  /**
   * Filter object by passing it through jsonIgnoreReplacer to remove any fields we don't want displayed.
   * Typically this is for fields that don't actually do anything on the current object, or fields that will
   * contain recursive data.
   * @returns 
   */
  filterData(): object
  {
    return JSON.parse(JSON.stringify(this.data, jsonIgnoreReplacer, 2));
  }

}