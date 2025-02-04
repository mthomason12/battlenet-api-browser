import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MediaMatcher } from '@angular/cdk/layout';
import { ApitreeComponent } from "../components/apitree/apitree.component";
import { ApiclientService } from '../services/apiclient.service';
import { UserdataService } from '../services/userdata.service';
import { dataStruct } from '../model/datastructs';
import { Subscription } from 'rxjs';
import FileSaver from 'file-saver';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, 
    MatProgressSpinnerModule, MatMenuModule, MatDialogModule,
    ApitreeComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'battlenet-api-browser';
  apiClient!: ApiclientService;

  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  readonly dialog = inject(MatDialog);
  private _snackBar = inject( MatSnackBar );


  private connectSubscription?: Subscription;

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
    this.connectSubscription?.unsubscribe();
  }  

  ngOnInit(): void {
    this.connectSubscription = this.apiCli.connectedEvent.subscribe(()=>{
      if (this.data.data.settings.autoLogin)
      {
        if (!this.apiCli.isLoggingIn())
        {
          this.apiCli.authenticate();
        }
      }
    }); 
  }

  connect()
  { 
    this.apiCli.connect();
  }

  bnetLogin()
  {  
    this.apiCli.authenticate();
  }

  debug()
  {
    this.apiCli.getAccountProfileSummary()?.then(
      (res)=>{
        console.dir(res);
      }
    )
  }

  export()
  {
    this._snackBar.open("Preparing export", "", {duration:2000});    
    this.data.exportJSON().then((json)=>{
      var blob = new Blob([json], {type: "text/json;charset=utf-8"});
      FileSaver.saveAs(blob, "battlenet-api-data.json", { autoBom: true });
      this._snackBar.open("Data exported", "", {duration:3000});
    })
  }

  settings()
  {
      this.dialog.open(SettingsDialog, {
        width: "90%"
      });
  }

  save()
  {
    this.data.save().then(()=>{
      this._snackBar.open("Data saved", "", {duration:3000});
    });
  }

}


@Component({
  selector: 'settings-dialog',
  templateUrl: 'settings-dialog.html',
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, CommonModule,
    SettingsComponent
  ],
})
export class SettingsDialog {
}
