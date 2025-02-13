import { Component} from '@angular/core';
import { achievementData } from '../../model/achievements';
import { MediaTableComponent } from "../../components/media-table/media-table.component";
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';


@Component({
  selector: 'app-achievement',
  imports: [MediaTableComponent],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss',
  inputs: ['data']
})
export class AchievementComponent extends AbstractDetailComponent<achievementData>{
}