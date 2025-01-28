import { factionStruct, linksStruct, moneyStruct, refStruct } from "./datastructs";

interface QuestRewardReputation {
    reward: refStruct;
    value: number;
}

interface QuestRewardItem {
    item?: refStruct;
    requirements?: {
        playable_specializations: refStruct[]; 
    }
}

interface QuestRewardItems {
    choice_of?: QuestRewardItem[]
}

interface QuestRewards {
    experience?: number;
    items?: QuestRewardItems;
    reputations?: QuestRewardReputation[];
    money?: moneyStruct;
}

interface QuestRequirements {
    min_character_level?: number;
    max_charactr_level?: number;
    faction?: factionStruct;
}

export interface QuestData {
    _links?: linksStruct;
    id?: number;
    title?: string;
    area?: refStruct;
    description?: string;
    requirements?: QuestRequirements;
    rewards?: QuestRewards;
}

export interface QuestCategoryData {
    _links?: linksStruct;
    id?: number;
    category?: string;
    quests: refStruct[];
}

export interface QuestCategoryIndex {
    _links?: linksStruct;
    categories: refStruct[];
}

export interface QuestAreaData {
    _links?: linksStruct;
    id?: number;
    area?: string;
    quests: refStruct[];
}

export interface QuestAreaIndex {
    _links?: linksStruct;
    areas: refStruct[];
}

export interface QuestTypeData {
    _links?: linksStruct;
    id?: number;
    type?: string;
    quests: refStruct[];
}

export interface QuestTypeIndex {
    _links?: linksStruct;
    types: refStruct[];
}