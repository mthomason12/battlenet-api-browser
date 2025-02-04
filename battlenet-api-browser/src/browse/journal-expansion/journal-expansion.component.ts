import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { journalExpansionData } from '../../model/journal';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-journal-expansion',
  imports: [ MatListModule, MatButtonModule ],
  templateUrl: './journal-expansion.component.html',
  styleUrl: './journal-expansion.component.scss',
  inputs: ['data']
})
export class JournalExpansionComponent extends AbstractDetailComponent<journalExpansionData>{

}
