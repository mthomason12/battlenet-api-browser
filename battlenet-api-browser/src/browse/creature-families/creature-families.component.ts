import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { creatureFamiliesDataDoc } from '../../model/gamedata';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-creature-families',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './creature-families.component.html',
  styleUrl: './creature-families.component.scss'
})
export class CreatureFamiliesComponent extends AbstractBrowseChildComponent<creatureFamiliesDataDoc>{

  override currentData(): creatureFamiliesDataDoc
  {
    console.dir();
    return this.data.data.apiData.wowpublic.creatureFamiliesData;
  }

}