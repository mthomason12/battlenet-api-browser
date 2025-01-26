import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthCallbackComponent } from '..//components/auth-callback/auth-callback.component';
import { BrowseComponent } from '../browse/browse.component';
import { AchievementsComponent } from '../browse/achievements/achievements.component';
import { AchievementComponent } from '../browse/achievement/achievement.component';
import { CovenantsComponent } from '../browse/covenants/covenants.component';
import { CovenantComponent } from '../browse/covenant/covenant.component';
import { CreatureFamiliesComponent } from '../browse/creature-families/creature-families.component';
import { CreatureTypesComponent } from '../browse/creature-types/creature-types.component';
import { CreatureFamilyComponent } from '../browse/creature-family/creature-family.component';
import { CreatureTypeComponent } from '../browse/creature-type/creature-type.component';
import { SoulbindComponent } from '../browse/soulbind/soulbind.component';
import { SoulbindsComponent } from '../browse/soulbinds/soulbinds.component';

export const routes: Routes = [
    { path: 'auth-callback', component: AuthCallbackComponent},
    { path: 'browse', component: BrowseComponent, children: [
        { path: 'public', children: [
            { path: 'achievements/:id', component: AchievementComponent},            
            { path: 'achievements', component: AchievementsComponent},
            { path: 'covenants/:id', component: CovenantComponent},              
            { path: 'covenants', component: CovenantsComponent},         
            { path: 'creature-families/:id', component: CreatureFamilyComponent}, 
            { path: 'creature-families', component: CreatureFamiliesComponent},    
            { path: 'creature-types/:id', component: CreatureTypeComponent},           
            { path: 'creature-types', component: CreatureTypesComponent},
            { path: 'soulbinds/:id', component: SoulbindComponent},              
            { path: 'soulbinds', component: SoulbindsComponent},               
            { path: '**', children: [] }
        ]},
        { path: 'profile', children: [
            { path: '**', children: [] }
        ]},       
        { path: '**', children: [] }
    ]},       
    { path: 'settings', component: SettingsComponent },
];
