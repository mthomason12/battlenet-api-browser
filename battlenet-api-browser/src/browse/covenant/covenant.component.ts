import { Component } from '@angular/core';
import { covenantDataDetailDoc, covenantDataDoc, covenantsDataDoc } from '../../model/covenants';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';

@Component({
  selector: 'app-covenant',
  imports: [ MatTabsModule, MatListModule, MatTableModule ],
  templateUrl: './covenant.component.html',
  styleUrl: './covenant.component.scss'
})
export class CovenantComponent  extends AbstractBrowseDetailComponent<covenantsDataDoc, covenantDataDoc, covenantDataDetailDoc>{
  
  override currentMaster(): covenantsDataDoc {
    return this.data.data.apiData.wowpublic.covenantData;
  }
  
}
