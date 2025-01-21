import { Component } from '@angular/core';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent {
  constructor(private apiclient: ApiclientService, private router: Router)
  {
  }

  ngOnInit(): void {
    let params = new URL(document.location.toString()).searchParams;
    this.apiclient.completeAuthentication(params.get('code')!, this.router);
  }
}
