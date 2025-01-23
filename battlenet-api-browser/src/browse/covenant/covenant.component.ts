import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { covenantDataDoc } from '../../model/covenants';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../userdata/userdata.service';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-covenant',
  imports: [ MatTabsModule, MatListModule, MatTableModule ],
  templateUrl: './covenant.component.html',
  styleUrl: './covenant.component.scss'
})
export class CovenantComponent  extends AbstractBrowseChildComponent<covenantDataDoc>{

  datadoc?: covenantDataDoc;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  override preinit()
  {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.data.data.apiData.wowpublic.covenantData.items.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!; 
  }

  override currentData(): covenantDataDoc
  {
    return this.datadoc!;
  }
}
