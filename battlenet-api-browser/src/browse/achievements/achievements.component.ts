import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { achievementsDataDoc } from '../../model/achievements';
import { ListDataItemComponent } from "../../components/list-data-item/list-data-item.component";

@Component({
  selector: 'app-achievements',
  imports: [ScrollingModule, ListDataItemComponent],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})

export class AchievementsComponent extends AbstractBrowseChildComponent<achievementsDataDoc> {

  override currentData(): achievementsDataDoc
  {
    return this.data.data.apiData.wowpublic.achievementData;
  }

}
