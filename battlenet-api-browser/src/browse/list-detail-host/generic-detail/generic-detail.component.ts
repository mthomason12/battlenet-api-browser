import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-generic-detail',
  imports: [],
  templateUrl: './generic-detail.component.html',
  styleUrl: './generic-detail.component.scss',
  inputs: ['data'],
})
export class GenericDetailComponent extends AbstractDetailComponent<any>{

}
