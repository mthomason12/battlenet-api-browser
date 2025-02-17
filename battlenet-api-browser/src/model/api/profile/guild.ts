/**
 * Guild API
 * @module
 */

import { linksStruct, factionStruct, realmStruct, guildCrestStruct, hrefStruct, characterRef, refStruct, idkeyStruct } from "../shared";

/**
 * Guild
 * 
 * /profile/wow/guild/{realmSlug}/{nameSlug}
 */
export interface APIGuild {
    _links: linksStruct;
    id: number;
    name: string;
    faction: factionStruct;
    achievement_points: number;
    member_count: number;
    realm: realmStruct;
    crest: guildCrestStruct;
    roster: hrefStruct;
    achievements: hrefStruct;
    created_timestamp: number;
    activity: hrefStruct;
    name_search: string;
}

/**
 * Guild Activity
 * 
 * /profile/wow/guild/{realmSlug}/{nameSlug}/activity
 */
export interface APIGuildActivity {
    _links: linksStruct;
    guild: {
        key: hrefStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    activities: (guildEncounterActivity | guildCharacterAchievementActivity)[]
}


export interface guildActivity {
    activity: {
        type: string;
    }
    timestamp: number;
}

export interface guildEncounterActivity extends guildActivity {
    encounter_completed: {
        encounter: refStruct;
        mode: {
            type: string;
            name: string;
        }
    }
}

export interface guildCharacterAchievementActivity extends guildActivity {
    character_achievement: {
        character: characterRef;
        achievement: refStruct;
    }
}

/**
 * Guild Achievements
 * 
 * /profile/wow/guild/{realmSlug}/{nameSlug}/achievements
 */
export interface APIGuildAchievements {
    _links: linksStruct;
    guild: {
        key: hrefStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    total_quantity: number;
    total_points: number;
    achievements: guildAchievement []
}

export interface guildAchievement {
    id: number;
    achievement: refStruct;
    criteria?: guildAchievementCriteriaStruct;
    completed_timestamp: number;
}

export interface guildAchievementCriteriaStruct {
    id: number;
    amount?: number;
    is_completed: boolean;
    child_criteria?: guildAchievementCriteriaStruct[]
}

/**
 * Guild Roster
 * 
 * /profile/wow/guild/{realmSlug}/{nameSlug}/roster
 */
export interface APIGuildRoster {
    _links: linksStruct;
    guild: {
        key: hrefStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    members: guildRosterMemberStruct[];
}

interface guildRosterMemberStruct {
    character: {
        key: hrefStruct;
        name: string;
        id: number;
        realm: realmStruct;
        level: number;
        playable_class: idkeyStruct;
        playable_race: idkeyStruct;
    }
    rank: number;
}

