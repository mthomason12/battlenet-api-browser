import { Component } from '@angular/core';
import { characterProfileData } from '../../../model/profile-characters';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../../components/key-value-table/key-value-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { characterAchievement, characterAchievementStatisticsCategory, characterProfession } from 'battlenet-api-types';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageSelectorComponent } from '../../../components/page-selector/page-selector.component';

@Component({
  selector: 'app-character',
  imports: [ MatTabsModule, MatTableModule, CommonModule, KeyValueTableComponent, MatExpansionModule, PageSelectorComponent],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent extends AbstractDetailComponent<characterProfileData> {

  overviewData: IKeyValueTableData[] = [];
  professionSummary: IKeyValueTableData[] = [];
  collectionSummary: IKeyValueTableData[] = [];
  statsData: IKeyValueTableData[] = [];
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
      { key: 'Equipped Item Level', value: this.data?.equipped_item_level!, button: {
        name: "Equipment", onClick: ()=>{}
      }},                          
      { key: 'Active Title', value: this.data?.active_title.name! , button: {
        name: "Other Titles", onClick: ()=>{}
      }},     
      { key: 'Achievement Points', value: this.data?.achievement_points!, button: {
        name: "Achievements", onClick: ()=>{}
      }},
      ...(this.data?.$soulbinds?.soulbinds?.length! > 0) ? [
        { key: 'Soulbinds', value: this.data?.$soulbinds?.soulbinds?.length! , button: {
          name: "Soulbinds", onClick: ()=>{}
        }}] : [],     
    ];
    this.professionSummary = [
      ...this.data?.$professions.primaries.map((item)=>{ return { key: item.profession.name!, value: this.profSkillTotal(item), button: {
        name: item.profession.name!, onClick: ()=>{}
      }}; })! as IKeyValueTableData[],
      ...this.data?.$professions.secondaries.map((item)=>{ return { key: item.profession.name!, value: this.profSkillTotal(item), button: {
        name: item.profession.name!, onClick: ()=>{}
      }}; })! as IKeyValueTableData[],
    ];
    this.collectionSummary = [
      { key: 'Heirlooms:', value: this.data?.$heirlooms?.heirlooms?.length! , button: {
        name: "Heirlooms", onClick: ()=>{}
      }},
      { key: 'Mounts:', value: this.data?.$mountData?.mounts?.length! , button: {
        name: "Mounts", onClick: ()=>{}
      }},
      { key: 'Pets:', value: this.data?.$petData?.pets?.length!, button: {
        name: "Pets", onClick: ()=>{}
      }},
      { key: 'Toys:', value: this.data?.$toyData?.toys?.length!, button: {
        name: "Toys", onClick: ()=>{}
      }},
      { key: 'Transmog Sets:', value: this.data?.$transmogData.appearance_sets?.length!, button: {
        name: "Transmog Sets", onClick: ()=>{}
      }},
      { key: 'Transmog Pieces:', value: this.transmogPieceCount(), button: {
        name: "Transmog Pieces", onClick: ()=>{}
      }},
    ]
    this.statsData = [
      { key: 'Strength (base)', value: this.data?.$statistics.strength.base!},
      { key: 'Strength (effective)', value: this.data?.$statistics.strength.effective!},       
      { key: 'Agility (base)', value: this.data?.$statistics.agility.base!},
      { key: 'Agility (effective)', value: this.data?.$statistics.agility.effective!},
      { key: 'Intellect (base)', value: this.data?.$statistics.intellect.base!},
      { key: 'Intellect (effective)', value: this.data?.$statistics.intellect.effective!},
      { key: 'Stamina (base)', value: this.data?.$statistics.stamina.base!},
      { key: 'Stamina (effective)', value: this.data?.$statistics.stamina.effective!},
    ]
    this.achievementData = this.data?.$achievements?.achievements!;
    this.statisticsData = this.data?.$achievementStatistics?.categories!;
  }

  getStatistics(cat: characterAchievementStatisticsCategory): IKeyValueTableData[] {
    return cat.statistics?.map((stat)=>{ return {
      key: stat.name+( stat.description ? ':'+stat.description : ''),
      value: stat.quantity
    }}) as IKeyValueTableData[];
  }

  transmogPieceCount(): number {
    var count = this.data?.$transmogData.slots.map((item)=>{ return item.appearances.length }).reduce((acc, current)=>{return acc+current});
    return count ? count : 0;
  }

  profSkillTotal(prof: characterProfession): number {
    return prof?.tiers?.map((item)=>{ return item.skill_points }).reduce((acc, current)=>{return acc+current});
  }

}
