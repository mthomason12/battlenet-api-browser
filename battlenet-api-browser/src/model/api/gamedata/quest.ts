/**
 * Quest API Return Types
 * @module
 */

import { factionStruct, hrefStruct, linksStruct, moneyStruct, refStruct } from "../shared";

//region Quests

/**
 * Quests Index
 * /data/wow/pet/index
 */
export interface APIQuestIndex {
    _links: linksStruct;
    categories: hrefStruct;
    areas: hrefStruct;
    types: hrefStruct
}


/**
 * Quest
 * /data/wow/quest/{{questId}}
 */
export interface APIQuest {
    _links: linksStruct;
    id?: number;
    title?: string;
    area?: refStruct;
    description?: string;
    requirements?: {
        min_character_level?: number;
        max_character_level?: number;
        faction?: factionStruct;
    };
    rewards?: {
        experience?: number;
        items?: {
            choice_of?: QuestRewardItem[];
        };
        reputations?: {
            reward: refStruct;
            value: number;
        }[];
        money?: moneyStruct;
    };
}


export interface QuestRewardItem {
    item?: refStruct;
    requirements?: {
        playable_specializations: refStruct[]; 
    }
}


//region Quest Categories

/**
 * Quest Categories Index
 * /data/wow/quest/category/index
 */
export interface APIQuestCategoriesIndex {
    _links: linksStruct;
    categories: refStruct[];
}

/**
 * Quest Category
 * /data/wow/quest/category/{{questCategoryId}}
 */
export interface APIQuestCategory {
    _links?: linksStruct;
    id?: number;
    category?: string;
    quests: refStruct[];
}

//region Quest Areas

/**
 * Quest Areas Index
 * /data/wow/quest/area/index
 */
export interface APIQuestAreasIndex {
    _links: linksStruct;
    areas: refStruct[];
}

/**
 * Quest Area
 * /data/wow/quest/area/index
 */
export interface APIQuestArea {
    _links: linksStruct;
    id?: number;
    area?: string;
    quests: refStruct[];
}

//region Quest Types

/**
 * Quest Types Index
 * /data/wow/quest/type/index
 */
export interface APIQuestTypesIndex {
    _links: linksStruct;
    types: refStruct[];
}

/**
 * Quest Type
 * /data/wow/quest/type/{{questTypeId}}
 */
export interface APIQuestType {
    _links?: linksStruct;
    id?: number;
    type?: string;
    quests: refStruct[];
}