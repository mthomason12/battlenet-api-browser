import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { connectedRealmData } from '../../model/connectedrealm';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-connected-realm',
  imports: [ MatListModule, MatButtonModule, RouterLink ],
  templateUrl: './connected-realm.component.html',
  styleUrl: './connected-realm.component.scss',
  inputs: ['data']
})
export class ConnectedRealmComponent extends AbstractDetailComponent<connectedRealmData>{

}
