import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { BrowseComponent } from '../browse/browse.component';

export const routes: Routes = [
    { path: '', component: BrowseComponent },  
    { path: 'settings', component: SettingsComponent },
];
