import { Component } from '@angular/core';
import { achievementDataDetailDoc, achievementDataDoc, achievementsDataDoc } from '../../model/achievements';
import { AbstractBrowseDetailComponent } from '../abstract-browse-detail/abstract-browse-detail.component';
import { MediaTableComponent } from "../../components/media-table/media-table.component";


@Component({
  selector: 'app-achievement',
  imports: [MediaTableComponent],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent extends AbstractBrowseDetailComponent<achievementsDataDoc, achievementDataDoc, achievementDataDetailDoc> {

  override currentMaster(): achievementsDataDoc
  {
    return this.data.data.apiData.wowpublic.achievementData;
  }

}