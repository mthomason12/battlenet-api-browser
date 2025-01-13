import { Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserdataService, dataStruct } from '../userdata/userdata.service';

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
  //dataSource = TREE_DATA;
  dataSource: dataStruct[];

  childrenAccessor = (node: dataStruct) => node.children() ?? [];

  hasChild = (_: number, node: dataStruct) => !!node.children() && node.children().length > 0;

  constructor(private dataService: UserdataService)
  {
    this.dataSource = dataService.data.apiData.children();
  }
}
