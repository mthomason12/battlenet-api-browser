import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MediaMatcher } from '@angular/cdk/layout';
import { ApitreeComponent } from "../components/apitree/apitree.component";
import { ApiclientService } from '../services/apiclient.service';
import { UserdataService } from '../services/userdata.service';
import { dataStruct } from '../model/datastructs';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatProgressSpinnerModule,
    ApitreeComponent, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'battlenet-api-browser';
  apiClient!: ApiclientService;
  treedata: dataStruct | undefined;

  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(private apiCli: ApiclientService, protected data: UserdataService, private router: Router)
  {
    this.apiClient = apiCli;
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 700px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }  

  connect()
  { 
    this.apiCli.connect();
  }

  bnetLogin()
  {  
    this.apiCli.authenticate(this.router );
  }

  debug()
  {
    this.apiCli.getAccountProfileSummary()?.then(
      (res)=>{
        console.dir(res);
      }
    )
  }
  treeChanged(item: dataStruct)
  {
    //item.postProcess();
    this.treedata = item;
    //console.dir(item);
  }

}
