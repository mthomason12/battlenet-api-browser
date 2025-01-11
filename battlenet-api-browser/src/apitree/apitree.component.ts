import { Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface APINode {
  name: string;
  children?: APINode[];
}

const TREE_DATA: APINode[] = [
  {
    name: 'Public API',
    children: [
      {name: 'Test1'},
      {name: 'Test2'}
    ],
  },
  {
    name: 'Profile API',
    children: [
      {name: 'Test1'},
      {name: 'Test2'}
    ],
  }
];

@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule ],
  templateUrl: './apitree.component.html',
  styleUrl: './apitree.component.scss'
})
export class ApitreeComponent {
  dataSource = TREE_DATA;

  childrenAccessor = (node: APINode) => node.children ?? [];

  hasChild = (_: number, node: APINode) => !!node.children && node.children.length > 0;
}
