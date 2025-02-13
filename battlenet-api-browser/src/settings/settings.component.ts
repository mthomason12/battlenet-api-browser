import { Component, input, OnInit, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserdataService } from '../services/userdata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { appKeyStruct, extensionDataStruct, settingsStruct } from '../model/userdata';
import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';
import { ExtensionManagerService } from '../extensions/extension-manager.service';
import { apiClientService } from '../services/apiclient.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { AbstractConnectionSettings } from '../extensions/abstract/abstract-connection-settings';

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

  connectionType: string = "";
  connectionName: string = "";
  connectionSettings?: Type<AbstractConnectionSettings>;

  defaultSettings?: extensionDataStruct;

  protected settingsInputs: Record<string, unknown> | undefined

  constructor(protected userdata: UserdataService, protected extmgr: ExtensionManagerService, protected api: apiClientService) 
  {
  }

  ngOnInit(): void {
    console.dir(this.settings());    
    this.defaultSettings = this.settings().getConnectionSettings("_default");    
    //prepare defaults
    this.defaultSettings['clientID'] = this.defaultSettings['clientID'] ?? '';
    this.defaultSettings['clientSecret'] = this.defaultSettings['clientSecret'] ?? '';
    this.connectionType = this.settings().api.connectionType ?? '_default';
    if (this.connectionType !== "_default")
      this.connectionSettings=this.extmgr.getConnection(this.connectionType)!.settings;
    this.connectionName = this.api.connections.get(this.connectionType)!.getName();
  }

  getConnections() {
    return this.api.connections;
  }

  currentConnection() {
    return this.api.apiConnection;
  }

  changeConnection() {
    this.settings().api.connectionType = this.connectionType;
    this.connectionType = this.settings().api.connectionType ?? '_default';
    this.settingsInputs = { 'settings': this.settings().getConnectionSettings(this.connectionType)};
    if (this.connectionType !== "_default")
      this.connectionSettings=this.extmgr.getConnection(this.connectionType)!.settings;
    this.connectionName = this.api.connections.get(this.connectionType)!.getName();    
  }

}
