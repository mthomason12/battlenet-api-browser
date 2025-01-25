import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { creatureTypesDataDoc } from '../../model/creature';
import { ListDataItemComponent } from "../../components/list-data-item/list-data-item.component";

@Component({
  selector: 'app-creature-types',
  imports: [ListDataItemComponent],
  templateUrl: './creature-types.component.html',
  styleUrl: './creature-types.component.scss'
})

export class CreatureTypesComponent extends AbstractBrowseChildComponent<creatureTypesDataDoc>{

  override currentData(): creatureTypesDataDoc
  {
    return this.data.data.apiData.wowpublic.creatureTypesData;
  }

}