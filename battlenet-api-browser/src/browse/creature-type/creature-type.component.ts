import { Component } from '@angular/core';
import { creatureTypeDataDoc, creatureTypeDetailsDoc, creatureTypesDataDoc } from '../../model/creature';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';

@Component({
  selector: 'app-creature-type',
  imports: [],
  templateUrl: './creature-type.component.html',
  styleUrl: './creature-type.component.scss'
})

export class CreatureTypeComponent extends AbstractBrowseDetailComponent<creatureTypesDataDoc, creatureTypeDataDoc, creatureTypeDetailsDoc>{

  override currentMaster(): creatureTypesDataDoc {
    return this.data.data.apiData.wowpublic.creatureTypesData;
  }

}
