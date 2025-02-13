import { Component, OnInit } from '@angular/core';
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
import { guildProfileData } from '../../../model/profile-guild';

@Component({
  selector: 'app-guild-master-search',
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
  templateUrl: './guild-master-search.component.html',
  styleUrl: './guild-master-search.component.scss',
  inputs: ['data','clicked']
})
export class GuildMasterSearchComponent extends AbstractMasterComponent<IMasterDetail> implements OnInit{
  lookupRealm: string = ""
  lookupGuild: string = "";

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
    if (this.lookupRealm.length > 0 && this.lookupGuild.length > 0)
    {
      this.data?.getSearch(this.api, new APISearchParams().add("realm",[this.lookupRealm]).add("guild",[this.lookupGuild])).then((results)=>{
        var res = (results! as guildProfileData[]);
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
