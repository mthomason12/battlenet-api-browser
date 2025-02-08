import { Component, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
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
import { apiClientService } from '../services/apiclient.service';
import { UserdataService } from '../services/userdata.service';
import { Subscription } from 'rxjs';
import { ApitreeComponent } from '../components/apitree/apitree.component';
import FileSaver from 'file-saver';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { JobQueueService } from '../services/jobqueue.service';
import { appKeyStruct, settingsStruct } from '../model/userdata';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, 
    MatProgressSpinnerModule, MatMenuModule, MatDialogModule, ApitreeComponent,
    RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'battlenet-api-browser';
  apiClient!: apiClientService;

  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  readonly dialog = inject(MatDialog);
  private _snackBar = inject( MatSnackBar );
  protected jobQueue = inject(JobQueueService);

  protected statusMessage: string = "";

  private connectSubscription?: Subscription;

  constructor(private apiCli: apiClientService, protected data: UserdataService, private router: Router)
  {
    this.apiClient = apiCli;
    this.apiClient.provideSettings(data.data.settings.api);

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
    this.checkStatus();
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
      var tempSettings: settingsStruct = structuredClone(this.data.data.settings);
      var tempKey: appKeyStruct = structuredClone(this.data.data.key);

      const dialogRef = this.dialog.open(SettingsDialog, {
        width: "90%",
        data: {settings: tempSettings, key: tempKey}
      });

      dialogRef.afterClosed().subscribe(result => {
        //do nothing, we just discard the new temporary settings
        console.log('The dialog was closed');
        if (Array.isArray(result)) {
          [this.data.data.settings, this.data.data.key]=(result);
          this.data.save();
          this.data.settingsChangedEmitter.emit();
        }
        this.checkStatus();
      });      
  }

  save()
  {
    this.data.save().then(()=>{
      this._snackBar.open("Data saved", "", {duration:3000});
    });
  }

  checkStatus()
  {
    this.statusMessage = "";
    if (!this.apiCli.canConnect())
    {
      this.statusMessage = "Unable to connect - check your settings from the top-right menu"
    }
  }

}

export interface DialogData {
  settings: settingsStruct;
  key: appKeyStruct;
}

@Component({
  selector: 'settings-dialog',
  templateUrl: 'settings-dialog.html',
  imports: [
    MatButtonModule, MatDialogContent, MatDialogActions, 
    MatDialogClose, MatDialogTitle, CommonModule, SettingsComponent
  ]
})
export class SettingsDialog {

  readonly dialogRef = inject(MatDialogRef<SettingsDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly settings = model(this.data.settings);
  readonly key = model(this.data.key);  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
