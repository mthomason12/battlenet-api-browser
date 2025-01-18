import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { achievementsDataDoc } from '../../model/achievements';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-achievements',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})

export class AchievementsComponent extends AbstractBrowseChildComponent {

  override currentData(): achievementsDataDoc
  {
    return this.data.data.apiData.wowpublic.achievementData;
  }

}
