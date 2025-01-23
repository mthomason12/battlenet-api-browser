import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { soulbindsDataDoc } from '../../model/covenants';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-soulbinds',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './soulbinds.component.html',
  styleUrl: './soulbinds.component.scss'
})
export class SoulbindsComponent extends AbstractBrowseChildComponent<soulbindsDataDoc>{

  override currentData(): soulbindsDataDoc
  {
    return this.data.data.apiData.wowpublic.soulbindsData;
  }

}
