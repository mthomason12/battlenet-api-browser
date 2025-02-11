import { characterRef, factionStruct, hrefStruct, IApiDataDoc, idkeyStruct, keyStruct, linksStruct, mediaStruct, realmStruct, refStruct, rgbaColorStruct } from "./datastructs";

interface guildRosterMemberStruct {
    character: {
        key: keyStruct;
        name: string;
        id: number;
        realm: realmStruct;
        level: number;
        playable_class: idkeyStruct;
        playable_race: idkeyStruct;
    }
    rank: number;
}

export interface guildRosterData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    members: guildRosterMemberStruct[];
}

interface guildAchievementCriteriaStruct {
    id: number;
    amount?: number;
    is_completed: boolean;
    child_criteria?: guildAchievementCriteriaStruct[]
}

interface guildAchievement {
    id: number;
    achievement: refStruct;
    criteria?: guildAchievementCriteriaStruct;
    completed_timestamp: number;
}

export interface guildAchievementData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    total_quantity: number;
    total_points: number;
    achievements: guildAchievement []
}

interface guildActivity {
    activity: {
        type: string;
    }
    timestamp: number;
}

interface guildEncounterActivity extends guildActivity{
    encounter_completed: {
        encounter: refStruct;
        mode: {
            type: string;
            name: string;
        }
    }
}

interface guildCharacterAchievementActivity extends guildActivity {
    character_achievement: {
        character: characterRef;
        achievement: refStruct;
    }
}

export interface guildActivityData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    activities: guildEncounterActivity | guildCharacterAchievementActivity []
}


interface guildCrestStruct {
    emblem: {
        id: number;
        media: mediaStruct;
        color: {
            id: number;
            rgba: rgbaColorStruct;
        }
    };
    border: {
        id: number;
        media: mediaStruct;
        color: {
            id: number;
            rgba: rgbaColorStruct;
        }
    };
    background: {
        color: {
            id: number,
            rgba: rgbaColorStruct;
        }
    };
}


export interface guildProfileData extends IApiDataDoc {
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