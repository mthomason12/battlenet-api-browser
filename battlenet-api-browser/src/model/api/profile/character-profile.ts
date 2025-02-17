/**
 * Character Profile API
 * @module
 */

import { factionStruct, genderStruct, hrefStruct, linksStruct, realmStruct, refStruct } from "../shared";

/**
 * Character Profile Summary 
 * 
 * /profile/wow/character/{realmSlug}/{characterName}
 */
export interface APICharacterProfileSummary {
    _links: linksStruct;
    id: number;
    name: string;
    gender: genderStruct;
    faction: factionStruct;
    race: refStruct;
    character_class: refStruct;
    active_spec: refStruct;
    realm: realmStruct;
    guild: {
        key: hrefStruct;
        name: string;
        id: number;
        realm: realmStruct;
        faction: factionStruct;
    };
    level: number;
    experience: number;
    achievement_points: number;
    achievements: hrefStruct;
    titles: hrefStruct;
    pvp_summary: hrefStruct;
    encounters: hrefStruct;
    media: hrefStruct;
    specializations: hrefStruct;
    statistics: hrefStruct;
    mythic_keystone_profile: hrefStruct;
    equipment: hrefStruct;
    appearance: hrefStruct;
    collections: hrefStruct;
    reputations: hrefStruct;
    quests: hrefStruct;
    achievements_statistics: hrefStruct;
    professions: hrefStruct;
    last_login_timestamp: number;
    average_item_level: number;
    equipped_item_level: number;
    active_title: {
        key: hrefStruct;
        name: string;
        id: number;
        display_string: string;
    }
    covenant_progress: {
        chosen_covenant: refStruct;
        renown_level: number;
        soulbinds: hrefStruct;
    }
    name_search: string;
}

/**
 * Character Profile Statis 
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/status
 */
export interface APICharacterProfileStatus {
    _links: linksStruct;
    id: number;
    is_valid: boolean;
}