import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthComponent } from '../auth/auth.component';
import { BrowseComponent } from '../browse/browse.component';

export const routes: Routes = [
    { path: 'browse', component: BrowseComponent, children: [
        { path: '**', component: BrowseComponent }
    ]},     
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
