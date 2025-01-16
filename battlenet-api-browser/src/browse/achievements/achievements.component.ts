import { Component } from '@angular/core';
import { AbstractBrowseChildComponent } from '../abstract-browse-child/abstract-browse-child.component';
import { achievementsDataDoc } from '../../userdata/userdata.service';

@Component({
  selector: 'app-achievements',
  imports: [],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})

export class AchievementsComponent extends AbstractBrowseChildComponent {

  override currentData(): achievementsDataDoc | undefined
  {
    return this.data.getCurrent() as achievementsDataDoc;
  }

}
