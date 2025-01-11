import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class ApiclientModule { 

  clientID: String;
  clientSecret: String;

  constructor (clientID: String, clientSecret: String)
  {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

}
