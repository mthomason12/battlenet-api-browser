import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserdataService } from '../userdata/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-settings',
  imports: [ FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent {
  clientId: string;
  clientSecret: string;

  constructor(private userdata: UserdataService)
  {
    this.clientId = this.userdata.data.key.clientID;
    this.clientSecret = this.userdata.data.key.clientSecret;
  }

  reset()
  {
    this.clientId = this.userdata.data.key.clientID;
    this.clientSecret = this.userdata.data.key.clientSecret;
  }

  save()
  {
    this.userdata.data.key.clientID = this.clientId;
    this.userdata.data.key.clientSecret = this.clientSecret;
    this.userdata.save();
  }
}
