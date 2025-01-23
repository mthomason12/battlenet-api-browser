import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { creatureTypeDataDoc } from '../../model/creature';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../userdata/userdata.service';

@Component({
  selector: 'app-creature-type',
  imports: [],
  templateUrl: './creature-type.component.html',
  styleUrl: './creature-type.component.scss'
})

export class CreatureTypeComponent extends AbstractBrowseChildComponent<creatureTypeDataDoc>{

  datadoc?: creatureTypeDataDoc;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  override preinit()
  {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.data.data.apiData.wowpublic.creatureTypesData.items.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!;   
  }

  override currentData(): creatureTypeDataDoc
  {
    return this.datadoc!;
  }
}
