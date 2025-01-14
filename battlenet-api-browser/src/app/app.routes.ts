import { Routes } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';
import { AuthComponent } from '../auth/auth.component';
import { NullComponent } from '../null/null.component';

export const routes: Routes = [
    { path: '', component: NullComponent},   
    { path: 'settings', component: SettingsComponent },
    { path: 'auth', component: AuthComponent },
];
