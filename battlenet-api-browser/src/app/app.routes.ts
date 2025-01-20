import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthComponent } from '../auth/auth.component';
import { BrowseComponent } from '../browse/browse.component';
import { AchievementsComponent } from '../browse/achievements/achievements.component';
import { AchievementComponent } from '../browse/achievement/achievement.component';
import { CovenantsComponent } from '../browse/covenants/covenants.component';
import { CovenantComponent } from '../browse/covenant/covenant.component';
import { AuthCallbackComponent } from '../auth-callback/auth-callback.component';

export const routes: Routes = [
    { path: 'auth-callback', component: AuthCallbackComponent},
    { path: 'browse', component: BrowseComponent, children: [
        { path: 'public', children: [
            { path: 'achievements/:id', component: AchievementComponent},            
            { path: 'achievements', component: AchievementsComponent},
            { path: 'covenants/:id', component: CovenantComponent},              
            { path: 'covenants', component: CovenantsComponent},            
            { path: '**', children: [] }
        ]},
        { path: 'profile', children: [
            { path: '**', children: [] }
        ]},       
        { path: '**', children: [] }
    ]},       
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
