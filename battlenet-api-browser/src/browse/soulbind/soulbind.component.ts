import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { soulbindDataDoc } from '../../model/covenants';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../userdata/userdata.service';

@Component({
  selector: 'app-soulbind',
  imports: [],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss'
})
export class SoulbindComponent  extends AbstractBrowseChildComponent<soulbindDataDoc>{

  datadoc?: soulbindDataDoc;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  override preinit()
  {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.data.data.apiData.wowpublic.soulbindsData.items.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!; 
  }

  override currentData(): soulbindDataDoc
  {
    return this.datadoc!;
  }
}
