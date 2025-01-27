import { Component, input } from '@angular/core';
import { soulbindDataDetailDoc } from '../../model/covenants';

@Component({
  selector: 'app-soulbind',
  imports: [],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss'
})


export class SoulbindComponent {
  data = input.required<soulbindDataDetailDoc>()
}
