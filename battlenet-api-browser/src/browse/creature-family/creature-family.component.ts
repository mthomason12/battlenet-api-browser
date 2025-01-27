import { Component } from '@angular/core';
import { creatureFamilyDetailsDoc } from '../../model/creature';
import { MediaTableComponent } from "../../components/media-table/media-table.component";
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-creature-family',
  imports: [MediaTableComponent],
  templateUrl: './creature-family.component.html',
  styleUrl: './creature-family.component.scss',
  inputs: ['data']
})
export class CreatureFamilyComponent extends AbstractDetailComponent<creatureFamilyDetailsDoc>{

}
