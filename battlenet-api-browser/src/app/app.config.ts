import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UserdataService } from '../services/userdata.service';
import { ApiclientService } from '../apiclient/apiclient.service';
import { CachedFileService } from '../components/cached-image/cached-file.service';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), 
    provideAnimationsAsync(), provideAnimationsAsync(), provideHttpClient(), provideOAuthClient(),
  {provide: UserdataService}, {provide: ApiclientService}, {provide: CachedFileService}
  ]
};
