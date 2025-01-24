import { Component } from '@angular/core';
import { soulbindDataDetailDoc, soulbindDataDoc, soulbindsDataDoc } from '../../model/covenants';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';

@Component({
  selector: 'app-soulbind',
  imports: [],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss'
})


export class SoulbindComponent  extends AbstractBrowseDetailComponent<soulbindsDataDoc, soulbindDataDoc, soulbindDataDetailDoc>{

  override currentMaster(): soulbindsDataDoc {
    return this.data.data.apiData.wowpublic.soulbindsData;
  }
}
