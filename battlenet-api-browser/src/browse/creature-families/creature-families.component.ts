import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { creatureFamiliesDataDoc } from '../../model/creature';
import { ListDataItemComponent } from "../../components/list-data-item/list-data-item.component";

@Component({
  selector: 'app-creature-families',
  imports: [ListDataItemComponent],
  templateUrl: './creature-families.component.html',
  styleUrl: './creature-families.component.scss'
})
export class CreatureFamiliesComponent extends AbstractBrowseChildComponent<creatureFamiliesDataDoc>{

  override currentData(): creatureFamiliesDataDoc
  {
    return this.data.data.apiData.wowpublic.creatureFamiliesData;
  }

}