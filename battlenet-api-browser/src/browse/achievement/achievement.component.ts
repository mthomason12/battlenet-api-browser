import { Component, input } from '@angular/core';
import { achievementDataDetailDoc } from '../../model/achievements';
import { MediaTableComponent } from "../../components/media-table/media-table.component";


@Component({
  selector: 'app-achievement',
  imports: [MediaTableComponent],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss'
})
export class AchievementComponent {
  data = input.required<achievementDataDetailDoc>()
}