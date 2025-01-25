import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { covenantsDataDoc } from '../../model/covenants';
import { ListDataItemComponent } from "../../components/list-data-item/list-data-item.component";


@Component({
  selector: 'app-covenants',
  imports: [ListDataItemComponent],
  templateUrl: './covenants.component.html',
  styleUrl: './covenants.component.scss'
})
export class CovenantsComponent extends AbstractBrowseChildComponent<covenantsDataDoc>{

  override currentData(): covenantsDataDoc
  {
    return this.data.data.apiData.wowpublic.covenantData;
  }

}
