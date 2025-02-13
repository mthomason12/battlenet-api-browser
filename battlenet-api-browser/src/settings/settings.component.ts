import { Component, input, OnInit } from '@angular/core';
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
import { ExtensionManagerService } from '../extensions/extension-manager.service';
import { apiClientService } from '../services/apiclient.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-settings',
  imports: [ FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, 
    MatExpansionModule, MatAccordion, MatCheckboxModule, MatCardModule, MatRadioModule, 
    MatTabsModule, MatSelectModule, CommonModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})

export class SettingsComponent implements OnInit{

  settings = input.required<settingsStruct>();
  key = input.required<appKeyStruct>();

  connectionType: string = "";

  constructor(protected userdata: UserdataService, protected extmgr: ExtensionManagerService, protected api: apiClientService) 
  {
  }

  ngOnInit(): void {
    this.connectionType = this.userdata.data.settings.api.connectionType!;
    this.connectionType = this.connectionType ?? "_default";
  }

  getConnections() {
    return this.api.connections;
  }

}
