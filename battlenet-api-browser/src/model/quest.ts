import { APIQuest, APIQuestArea, APIQuestAreasIndex, APIQuestCategoriesIndex, APIQuestCategory, APIQuestType, APIQuestTypesIndex } from "./api/gamedata/quest";

export interface QuestData extends APIQuest {
}

export interface QuestCategoryData extends APIQuestCategory{
}

export interface QuestCategoryIndex extends APIQuestCategoriesIndex {
}

export interface QuestAreaData extends APIQuestArea {
}

export interface QuestAreaIndex extends APIQuestAreasIndex {
}

export interface QuestTypeData extends APIQuestType {
}

export interface QuestTypeIndex extends APIQuestTypesIndex{
}