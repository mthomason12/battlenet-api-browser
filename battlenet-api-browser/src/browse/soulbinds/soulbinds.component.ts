import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { soulbindsDataDoc } from '../../model/covenants';
import { ListDataItemComponent } from "../../components/list-data-item/list-data-item.component";


@Component({
  selector: 'app-soulbinds',
  imports: [ListDataItemComponent],
  templateUrl: './soulbinds.component.html',
  styleUrl: './soulbinds.component.scss'
})
export class SoulbindsComponent extends AbstractBrowseChildComponent<soulbindsDataDoc>{

  override currentData(): soulbindsDataDoc
  {
    return this.data.data.apiData.wowpublic.soulbindsData;
  }

}
