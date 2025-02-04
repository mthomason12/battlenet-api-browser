import { Component } from '@angular/core';
import { soulbindData } from '../../model/covenants';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-soulbind',
  imports: [],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss',
  inputs: ['data']
})

export class SoulbindComponent extends AbstractDetailComponent<soulbindData>{
}
