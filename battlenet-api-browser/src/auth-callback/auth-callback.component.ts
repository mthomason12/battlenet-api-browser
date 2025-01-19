import { Component } from '@angular/core';
import { ApiclientService } from '../apiclient/apiclient.service';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent {
  constructor(private apiclient: ApiclientService) { }

  ngOnInit(): void {
    this.apiclient.completeAuthentication();
  }
}
