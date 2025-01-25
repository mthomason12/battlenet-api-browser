import { Component } from '@angular/core';
import { covenantDataDetailDoc, covenantDataDoc, covenantsDataDoc } from '../../model/covenants';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';
import { CachedImageComponent } from "../../components/cached-image/cached-image.component";

@Component({
  selector: 'app-covenant',
  imports: [MatTabsModule, MatListModule, MatTableModule, MatButtonModule, RouterLink, CachedImageComponent],
  templateUrl: './covenant.component.html',
  styleUrl: './covenant.component.scss'
})
export class CovenantComponent  extends AbstractBrowseDetailComponent<covenantsDataDoc, covenantDataDoc, covenantDataDetailDoc>{
  
  override currentMaster(): covenantsDataDoc {
    return this.data.data.apiData.wowpublic.covenantData;
  }
  
}
