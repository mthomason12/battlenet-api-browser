import { Component } from '@angular/core';
import { characterProfileData } from '../../../model/profile-characters';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../../components/key-value-table/key-value-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { characterAchievement, characterAchievementStatisticsCategory } from 'battlenet-api-types';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-character',
  imports: [ MatTabsModule, MatTableModule, CommonModule, KeyValueTableComponent, MatExpansionModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent extends AbstractDetailComponent<characterProfileData> {

  overviewData: IKeyValueTableData[] = [];
  achievementData: characterAchievement[] = [];
  statisticsData: characterAchievementStatisticsCategory[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'Name', value: this.data?.name! },
      { key: 'ID', value: this.data?.id! },
      { key: 'Faction', value: this.data?.faction.name! },
      { key: 'Realm', value: this.data?.realm.name! },
      { key: 'Class', value: this.data?.character_class.name! },      
      { key: 'Active Spec', value: this.data?.active_spec.name!, button: {
        name: "Other Specs", onClick: ()=>{}
      }},
      ...(this.data?.$hunterPets?.hunter_pets.length! > 0) ? [
        { key: 'Hunter Pets', value: this.data?.$hunterPets.hunter_pets.length! , button: {
          name: "Hunter Pets", onClick: ()=>{}
        }}] : [],      
      { key: 'Equipped Item Level', value: this.data?.equipped_item_level! },                          
      { key: 'Active Title', value: this.data?.active_title.name! , button: {
        name: "Other Titles", onClick: ()=>{}
      }},     
      { key: 'Achievement Points', value: this.data?.achievement_points! },
    ];
    this.achievementData = this.data?.$achievements?.achievements!;
    this.statisticsData = this.data?.$achievementStatistics?.categories!;
  }

  getStatistics(cat: characterAchievementStatisticsCategory): IKeyValueTableData[] {
    return cat.statistics?.map((stat)=>{ return {
      key: stat.name+( stat.description ? ':'+stat.description : ''),
      value: stat.quantity
    }}) as IKeyValueTableData[];
  }

}
