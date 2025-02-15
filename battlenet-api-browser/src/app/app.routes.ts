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
import { CharacterMasterSearchComponent } from '../browse/list-detail-host/character-master-search/character-master-search.component';
import { GuildMasterSearchComponent } from '../browse/list-detail-host/guild-master-search/guild-master-search.component';

export const routes: Routes = [
    { path: 'auth-callback', component: AuthCallbackComponent},
    { path: 'browse', component: BrowseComponent, children: [
        { path: 'account', children: [           
            { path: 'characters', redirectTo: 'characters/', pathMatch: 'full'},               
            { path: 'characters/:id', component: ListDetailHostComponent, 
                data:{list: ["wowaccount","account-characters"], listPages: [
                    { title: 'Table', component: CharacterTableComponent }
                ]} 
            },
            { path: 'heirlooms', component: ListDetailHostComponent,
                data:{ list: ["wowaccount","account-heirlooms"] } 
            },
            { path: 'mounts', component: ListDetailHostComponent,
                data:{ list: ["wowaccount","account-mounts"] } 
            },
            { path: 'pets',  component: ListDetailHostComponent, 
                data:{list: ["wowaccount","account-pets"]} 
            },    
        ]},
        { path: 'public', children: [
            { path: 'achievements', redirectTo: 'achievements/', pathMatch: 'full'},
            { path: 'achievements/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","achievements"], detailComponent: AchievementComponent} 
            },
            { path: 'connected-realms', redirectTo: 'connected-realms/', pathMatch: 'full'},               
            { path: 'connected-realms/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","connected-realms"], detailComponent: ConnectedRealmComponent} 
            },       
            { path: 'covenants', redirectTo: 'covenants/', pathMatch: 'full'},               
            { path: 'covenants/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","covenants"], detailComponent: CovenantComponent} 
            }, 
            { path: 'creature-families', redirectTo: 'creature-families/', pathMatch: 'full'},                
            { path: 'creature-families/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","creature-families"], detailComponent: CreatureFamilyComponent} 
            },  
            { path: 'creature-types', redirectTo: 'creature-types/', pathMatch: 'full'}, 
            { path: 'creature-types/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","creature-types"], detailComponent: CreatureTypeComponent} 
            }, 
            { path: 'encounters', redirectTo: 'encounters/', pathMatch: 'full'},               
            { path: 'encounters/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","journal-encounters"] } 
            },   
            { path: 'expansions', redirectTo: 'expansions/', pathMatch: 'full'},               
            { path: 'expansions/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","journal-expansions"], detailComponent: JournalExpansionComponent} 
            },          
            { path: 'instances', redirectTo: 'instances/', pathMatch: 'full'},               
            { path: 'instances/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","journal-instances"] } 
            },         
            { path: 'items', redirectTo: 'items/', pathMatch: 'full'},               
            { path: 'items/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","items"] } 
            },   
            { path: 'mounts', redirectTo: 'mounts/', pathMatch: 'full'}, 
            { path: 'mounts/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","mounts"]} 
            },      
            { path: 'pets', redirectTo: 'pets/', pathMatch: 'full'}, 
            { path: 'pets/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","pets"]} 
            },      
            { path: 'pet-abilities', redirectTo: 'pet-abilities/', pathMatch: 'full'}, 
            { path: 'pet-abilities/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","pet-abilities"]} 
            },                                              
            { path: 'realms', redirectTo: 'realms/', pathMatch: 'full'},   
            { path: 'realms/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","realms"], detailComponent: RealmComponent, hideKey: true} 
            },  
            { path: 'regions', redirectTo: 'regions/', pathMatch: 'full'},   
            { path: 'regions/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","region"] } 
            },       
            { path: 'reputation-factions', redirectTo: 'reputation-factions/', pathMatch: 'full'},   
            { path: 'reputation-factions/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","reputation-faction"] } 
            },  
            { path: 'reputation-tiers', redirectTo: 'reputation-tiers/', pathMatch: 'full'},   
            { path: 'reputation-tiers/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","reputation-tier"] } 
            },                                      
            { path: 'soulbinds', redirectTo: 'soulbinds/', pathMatch: 'full'},   
            { path: 'soulbinds/:id', component: ListDetailHostComponent, 
                data:{list: ["wowpublic","soulbinds"], detailComponent: SoulbindComponent} 
            },
            { path: '**', children: [] }
        ]},
        { path: 'profile', children: [
            { path: 'characters', redirectTo: 'characters/', pathMatch: 'full'},
            { path: 'characters/:id', component: ListDetailHostComponent, 
                data:{list: ["wowprofile","profile-characters"], listComponent: CharacterMasterSearchComponent} 
            },      
            { path: 'guilds', redirectTo: 'guilds/', pathMatch: 'full'},
            { path: 'guilds/:id', component: ListDetailHostComponent, 
                data:{list: ["wowprofile","profile-guilds"], listComponent: GuildMasterSearchComponent} 
            },                        
            { path: '**', children: [] }
        ]},       
        { path: '**', children: [] }
    ]}
];
