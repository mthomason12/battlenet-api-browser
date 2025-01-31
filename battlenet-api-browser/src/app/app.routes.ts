import { Routes } from '@angular/router';
import { AuthCallbackComponent } from '..//components/auth-callback/auth-callback.component';
import { BrowseComponent } from '../browse/browse.component';
import { AchievementComponent } from '../browse/achievement/achievement.component';
import { CovenantComponent } from '../browse/covenant/covenant.component';
import { CreatureFamilyComponent } from '../browse/creature-family/creature-family.component';
import { CreatureTypeComponent } from '../browse/creature-type/creature-type.component';
import { SoulbindComponent } from '../browse/soulbind/soulbind.component';
import { ListDetailHostComponent } from '../browse/list-detail-host/list-detail-host.component';
import { RealmComponent } from '../browse/realm/realm.component';
import { ConnectedRealmComponent } from '../browse/connected-realm/connected-realm.component';
import { CharacterTableComponent } from '../browse/list-detail-host/character-table/character-table.component';
import { JournalExpansionComponent } from '../browse/journal-expansion/journal-expansion.component';

export const routes: Routes = [
    { path: 'auth-callback', component: AuthCallbackComponent},
    { path: 'browse', component: BrowseComponent, children: [
        { path: 'account', children: [           
            { path: 'characters', redirectTo: 'characters/', pathMatch: 'full'},               
            { path: 'characters/:id', component: ListDetailHostComponent, 
                data:{list: ["wowaccount","characterData"], listPages: [
                    { title: 'Table', component: CharacterTableComponent }
                ]} 
            }
        ]},
        { path: 'public', children: [
            { path: 'achievements', redirectTo: 'achievements/', pathMatch: 'full'},
            { path: 'achievements/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","achievementData"], detailComponent: AchievementComponent} 
            },
            { path: 'connected-realms', redirectTo: 'connected-realms/', pathMatch: 'full'},               
            { path: 'connected-realms/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","connectedRealmData"], detailComponent: ConnectedRealmComponent} 
            },       
            { path: 'covenants', redirectTo: 'covenants/', pathMatch: 'full'},               
            { path: 'covenants/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","covenantData"], detailComponent: CovenantComponent} 
            }, 
            { path: 'creature-families', redirectTo: 'creature-families/', pathMatch: 'full'},                
            { path: 'creature-families/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","creatureFamiliesData"], detailComponent: CreatureFamilyComponent} 
            },  
            { path: 'creature-types', redirectTo: 'creature-types/', pathMatch: 'full'}, 
            { path: 'creature-types/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","creatureTypesData"], detailComponent: CreatureTypeComponent} 
            },  
            { path: 'expansions', redirectTo: 'expansions/', pathMatch: 'full'},               
            { path: 'expansions/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","journalExpansionData"], detailComponent: JournalExpansionComponent} 
            },                  
            { path: 'mounts', redirectTo: 'mounts/', pathMatch: 'full'}, 
            { path: 'mounts/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","mountData"]} 
            },                      
            { path: 'realms', redirectTo: 'realms/', pathMatch: 'full'},   
            { path: 'realms/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","realmData"], detailComponent: RealmComponent, hideKey: true} 
            },  
            { path: 'soulbinds', redirectTo: 'soulbinds/', pathMatch: 'full'},   
            { path: 'soulbinds/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","soulbindsData"], detailComponent: SoulbindComponent} 
            },
            { path: '**', children: [] }
        ]},
        { path: 'profile', children: [
            { path: '**', children: [] }
        ]},       
        { path: '**', children: [] }
    ]}
];
