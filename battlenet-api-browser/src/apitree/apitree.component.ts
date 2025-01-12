import { Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface APINode {
  name: string;
  path?: string;
  url?: string;
  children?: APINode[];
}

const TREE_DATA: APINode[] = [
  {
    name: 'Game Data API',
    path: 'public',
    children: [
      {
        name: 'World of Warcraft',
        path: 'public.wow',
        children: [
          {name: 'Achievements', path: 'public.wow.achievement', url:'/data/wow/achievement/index'}
        ]
      }
    ],
  },
  {
    name: 'Profile API',
    path: 'profile',
    children: [
      {
        name: 'World of Warcraft',
        path: 'profile.wow',
        children: [
          {name: 'Profile Summary', path: 'profile.wow.profilesummary', url:'/profile/user/wow'}
        ]        
      }
    ],
  }
];

@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './apitree.component.html',
  styleUrl: './apitree.component.scss'
})
export class ApitreeComponent {
  dataSource = TREE_DATA;

  childrenAccessor = (node: APINode) => node.children ?? [];

  hasChild = (_: number, node: APINode) => !!node.children && node.children.length > 0;
}
