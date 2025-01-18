import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ApitreeComponent } from "../apitree/apitree.component";
import { ApiclientService } from '../apiclient/apiclient.service';
import { UserdataService } from '../userdata/userdata.service';
import { dataStruct } from '../userdata/datastructs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule,
    ApitreeComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'battlenet-api-browser';
  apiClient!: ApiclientService;
  treedata: dataStruct | undefined;

  constructor(private apiCli: ApiclientService, private userdata: UserdataService)
  {
    this.apiClient = apiCli;
  }

  connect()
  {
    this.apiCli.connect("us", this.userdata.data.key.clientID, this.userdata.data.key.clientSecret);
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
