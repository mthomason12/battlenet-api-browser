import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserdataService } from '../services/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { appKeyStruct, settingsStruct } from '../model/userdata';
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

  settings = input.required<settingsStruct>();
  key = input.required<appKeyStruct>();

  constructor(protected userdata: UserdataService)
  {
  }

}
