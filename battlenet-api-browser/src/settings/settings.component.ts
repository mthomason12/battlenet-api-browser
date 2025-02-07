import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserdataService } from '../services/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { settingsStruct } from '../model/userdata';
import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';

@Component({
  selector: 'app-settings',
  imports: [ FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, 
    MatExpansionModule, MatAccordion, MatCheckboxModule, MatCardModule, MatRadioModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent {
  clientId: string;
  clientSecret: string;
  settings: settingsStruct = new settingsStruct()

  constructor(protected userdata: UserdataService)
  {
    this.clientId = this.userdata.data.key.clientID;
    this.clientSecret = this.userdata.data.key.clientSecret;
    this.settings = _.merge(this.settings, this.userdata.data.settings)
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
