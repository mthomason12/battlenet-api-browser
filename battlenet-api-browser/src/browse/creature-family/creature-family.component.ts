import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { creatureFamilyDataDoc } from '../../model/creature';
import { ActivatedRoute } from '@angular/router';
import { UserdataService } from '../../userdata/userdata.service';

@Component({
  selector: 'app-creature-family',
  imports: [],
  templateUrl: './creature-family.component.html',
  styleUrl: './creature-family.component.scss'
})
export class CreatureFamilyComponent extends AbstractBrowseChildComponent<creatureFamilyDataDoc>{

  datadoc?: creatureFamilyDataDoc;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  override preinit()
  {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.data.data.apiData.wowpublic.creatureFamiliesData.items.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!; 
  }

  override currentData(): creatureFamilyDataDoc
  {
    return this.datadoc!;
  }
}
