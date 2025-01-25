import { Component } from '@angular/core';
import { creatureFamiliesDataDoc, creatureFamilyDataDoc, creatureFamilyDetailsDoc } from '../../model/creature';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';
import { MediaTableComponent } from "../../components/media-table/media-table.component";

@Component({
  selector: 'app-creature-family',
  imports: [MediaTableComponent],
  templateUrl: './creature-family.component.html',
  styleUrl: './creature-family.component.scss'
})
export class CreatureFamilyComponent extends AbstractBrowseDetailComponent<creatureFamiliesDataDoc, creatureFamilyDataDoc, creatureFamilyDetailsDoc>{

  override currentMaster(): creatureFamiliesDataDoc {
    return this.data.data.apiData.wowpublic.creatureFamiliesData;
  }

}
