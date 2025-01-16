import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthComponent } from '../auth/auth.component';
import { BrowseComponent } from '../browse/browse.component';
import { AchievementsComponent } from '../browse/achievements/achievements.component';

export const routes: Routes = [
    { path: 'browse', component: BrowseComponent, children: [
        { path: 'achievements', component: AchievementsComponent},
        { path: '**', component: undefined }
    ]},     
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
