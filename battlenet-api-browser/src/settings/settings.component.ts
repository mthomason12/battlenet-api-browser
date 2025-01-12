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
    this.clientId = this.userdata.data.clientID;
    this.clientSecret = this.userdata.data.clientSecret;
  }

  reset()
  {
    this.clientId = this.userdata.data.clientID;
    this.clientSecret = this.userdata.data.clientSecret;
  }

  save()
  {
    this.userdata.data.clientID = this.clientId;
    this.userdata.data.clientSecret = this.clientSecret;
    this.userdata.save();
  }
}
