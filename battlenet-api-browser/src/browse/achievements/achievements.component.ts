import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { achievementsDataDoc } from '../../model/achievements';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-achievements',
  imports: [MatButtonModule, ScrollingModule, RouterLink],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})

export class AchievementsComponent extends AbstractBrowseChildComponent<achievementsDataDoc> {

  override currentData(): achievementsDataDoc
  {
    return this.data.data.apiData.wowpublic.achievementData;
  }

}
