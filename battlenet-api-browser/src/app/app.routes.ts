import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthComponent } from '../auth/auth.component';

export const routes: Routes = [
    { path: '', children: []},   
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
