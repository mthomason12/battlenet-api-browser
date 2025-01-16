import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { MatButtonModule } from '@angular/material/button';
import { achievementsDataDoc } from '../../userdata/userdata.service';

@Component({
  selector: 'app-achievements',
  imports: [MatButtonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})

export class AchievementsComponent extends AbstractBrowseChildComponent {

  override currentData(): achievementsDataDoc
  {
    return this.data.data.apiData.wowpublic.achievementData;
  }

}
