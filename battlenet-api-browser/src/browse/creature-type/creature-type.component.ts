import { Component } from '@angular/core';
import { creatureTypeData } from '../../model/creature';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-creature-type',
  imports: [],
  templateUrl: './creature-type.component.html',
  styleUrl: './creature-type.component.scss',
  inputs: ['data']
})

export class CreatureTypeComponent extends AbstractDetailComponent<creatureTypeData>{
}
