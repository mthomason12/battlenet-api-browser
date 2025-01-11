import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatDrawerMode } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ApitreeComponent } from "../apitree/apitree.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, ApitreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'battlenet-api-browser';
}
