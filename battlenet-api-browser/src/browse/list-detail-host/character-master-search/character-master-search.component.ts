import { Component, inject, OnInit } from '@angular/core';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { IMasterDetail } from '../../../model/dbdatastructs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ListDataItemComponent } from '../../../components/list-data-item/list-data-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { UserdataService } from '../../../services/userdata.service';
import { APISearchParams } from '../../../services/apisearch';
import { characterProfileData } from '../../../model/profile-characters';

@Component({
  selector: 'app-character-master-search',
  imports: [
      ScrollingModule,
      CommonModule,
      ListDataItemComponent,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule
    ],
  templateUrl: './character-master-search.component.html',
  styleUrl: './character-master-search.component.scss',
  inputs: ['data','clicked']
})
export class CharacterMasterSearchComponent extends AbstractMasterComponent<IMasterDetail> implements OnInit{
  lookupRealm: string = ""
  lookupCharacter: string = "";

  //list of realms for the drop-down list
  realms?: {
    name: string,
    slug: string
  }[] = [];

  constructor(protected userData: UserdataService) {
    super();
  }

  ngOnInit(): void {
      //fill realms list
      var realmData = this.userData.data.apiData.wowpublic.realmData;
      realmData.getIndex(this.api).then((realmIndex)=>{
        this.realms = realmIndex?.realms.map((item)=>{
          return {
            name: item.name,
            slug: item.slug
          }
        }).sort((a,b)=>{ return (""+a.name).localeCompare(b.name)});
      })
  }

  doSearch() {
    if (this.lookupRealm.length > 0 && this.lookupCharacter.length > 0)
    {
      this.data?.getSearch(this.api, new APISearchParams().add("realm",[this.lookupRealm]).add("character",[this.lookupCharacter])).then((results)=>{
        var res = (results! as characterProfileData[]);
        if (res.length > 0)
        {
          this.data?.addIndexItems(this.api, res).then(()=>{
            //tell the component we've changed the data
            this.dataSet();
          });
        }
      });
    }
  }


}
