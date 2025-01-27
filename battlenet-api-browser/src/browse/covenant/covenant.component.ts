import { Component, input } from '@angular/core';
import { covenantDataDetailDoc } from '../../model/covenants';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MediaTableComponent } from '../../components/media-table/media-table.component';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';

@Component({
  selector: 'app-covenant',
  imports: [MatTabsModule, MatListModule, MatTableModule, MatButtonModule, RouterLink, MediaTableComponent],
  templateUrl: './covenant.component.html',
  styleUrl: './covenant.component.scss',
  inputs: ['data']
})
export class CovenantComponent extends AbstractDetailComponent<covenantDataDetailDoc>{
}