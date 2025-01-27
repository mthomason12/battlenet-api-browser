import { Component } from '@angular/core';
import { realmDataDetailDoc } from '../../model/realm';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-realm',
  imports: [],
  templateUrl: './realm.component.html',
  styleUrl: './realm.component.scss',
  inputs: ['data']
})
export class RealmComponent extends AbstractDetailComponent<realmDataDetailDoc>{

}
