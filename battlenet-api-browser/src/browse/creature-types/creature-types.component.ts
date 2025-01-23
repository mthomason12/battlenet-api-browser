import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { creatureTypesDataDoc } from '../../model/creature';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-creature-types',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './creature-types.component.html',
  styleUrl: './creature-types.component.scss'
})

export class CreatureTypesComponent extends AbstractBrowseChildComponent<creatureTypesDataDoc>{

  override currentData(): creatureTypesDataDoc
  {
    return this.data.data.apiData.wowpublic.creatureTypesData;
  }

}