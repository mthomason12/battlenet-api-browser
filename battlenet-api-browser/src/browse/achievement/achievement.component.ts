import { Component, OnInit } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { achievementDataDoc } from '../../model/achievements';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { UserdataService } from '../../userdata/userdata.service';


    

@Component({
  selector: 'app-achievement',
  imports: [],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})

export class AchievementComponent extends AbstractBrowseChildComponent{

  datadoc?: achievementDataDoc;
  id?: string;

  constructor(private route: ActivatedRoute, protected override data: UserdataService)
  {
    super(data);
  }

  override preinit()
  {
    this.id = this.route.snapshot.paramMap.get('id') ?? "";    
    this.datadoc = this.data.data.apiData.wowpublic.achievementData.achievements.find(
      (data, index, array)=>{
        return Number.parseInt(this.id!) == data.id;
      }
    )!;
    console.dir(this.datadoc);   
  }

  override currentData(): achievementDataDoc
  {
    return this.datadoc!;
  }
}
