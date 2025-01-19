import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { ApitreeComponent } from "../apitree/apitree.component";
import { ApiclientService } from '../apiclient/apiclient.service';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct } from '../model/datastructs';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MatProgressSpinnerModule,
    ApitreeComponent, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'battlenet-api-browser';
  apiClient!: ApiclientService;
  treedata: dataStruct | undefined;

  constructor(private apiCli: ApiclientService, protected data: UserdataService)
  {
    this.apiClient = apiCli;
  }

  connect()
  {
    this.apiCli.connect("us", this.data.data.key.clientID, this.data.data.key.clientSecret);
    /*this.apiClient.achievementIndex()?.then((data)=>{
      console.log("Data returned: "+JSON.stringify(data))
    });*/
  }

  treeChanged(item: dataStruct)
  {
    //item.postProcess();
    this.treedata = item;
    //console.dir(item);
  }

}
