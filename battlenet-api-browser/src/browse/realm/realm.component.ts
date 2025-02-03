import { Component } from '@angular/core';
import { realmData } from '../../model/realm';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-realm',
  imports: [],
  templateUrl: './realm.component.html',
  styleUrl: './realm.component.scss',
  inputs: ['data']
})
export class RealmComponent extends AbstractDetailComponent<realmData>{

}
