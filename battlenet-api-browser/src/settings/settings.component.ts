import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserdataService } from '../services/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { settingsStruct } from '../model/userdata';

@Component({
  selector: 'app-settings',
  imports: [ FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatExpansionModule, MatAccordion, MatCheckboxModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent {
  clientId: string;
  clientSecret: string;
  settings: settingsStruct = new settingsStruct()

  constructor(private userdata: UserdataService)
  {
    this.clientId = this.userdata.data.key.clientID;
    this.clientSecret = this.userdata.data.key.clientSecret;
    this.settings = this.userdata.data.settings;
  }

  reset()
  {
    this.clientId = this.userdata.data.key.clientID;
    this.clientSecret = this.userdata.data.key.clientSecret;
    this.settings = this.userdata.data.settings;
  }

  save()
  {
    this.userdata.data.key.clientID = this.clientId;
    this.userdata.data.key.clientSecret = this.clientSecret;
    this.userdata.data.settings = this.settings;
    this.userdata.save();
  }
}
