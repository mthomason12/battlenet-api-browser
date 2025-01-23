import { Component, input } from '@angular/core';
import { dataStruct } from '../../model/datastructs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  location = input.required<dataStruct>();
}
