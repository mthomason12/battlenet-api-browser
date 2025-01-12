import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { BrowseComponent } from '../browse/browse.component';
import { AuthComponent } from '../auth/auth.component';

export const routes: Routes = [
    { path: '', component: BrowseComponent }, 
    { path: 'browse', component: BrowseComponent },      
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
