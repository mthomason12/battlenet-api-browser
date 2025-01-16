import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { covenantsDataDoc } from '../../userdata/userdata.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-covenants',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './covenants.component.html',
  styleUrl: './covenants.component.scss'
})
export class CovenantsComponent extends AbstractBrowseChildComponent{

  override currentData(): covenantsDataDoc
  {
    return this.data.data.apiData.wowpublic.covenantData;
  }

}
