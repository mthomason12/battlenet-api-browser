import { Component, input } from '@angular/core';
import { soulbindDataDetailDoc } from '../../model/covenants';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-soulbind',
  imports: [],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss',
  inputs: ['data']
})

export class SoulbindComponent extends AbstractDetailComponent<soulbindDataDetailDoc>{
}
