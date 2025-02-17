/**
 * Character Achievements API
 * @module
 */

import { linksStruct, refStruct, characterRef, hrefStruct } from "../shared";

/**
 * Character Achievements Summary 
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/achievements
 */
export interface APICharacterAchievementsSummary {
    _links: linksStruct;
    total_quantity: number;
    total_points: number;
    achievements: {
        id: number;
        achievement: refStruct;
        criteria: characterAchievementCriteria[]
        completed_timestamp: number;
    };
    character: characterRef;
    statistics: hrefStruct;
}

/**
 * Part of @see APICharacterAchievementsSummary
 */
export interface characterAchievementCriteria
{
    id: number;
    is_completed: boolean;
    child_criteria?: characterAchievementCriteria[];
}

/**
 * Character Achievements Statistics 
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/achievements/statistics
 */
export interface APICharacterAchievementsStatistics {
    _links: linksStruct;    
    character: characterRef;
    statistics: {
        id: number;
        name: string;
        last_updated_timestamp: number;
        quantity: number;
    };
    categories: characterAchievementStatisticsCategory[];
}

export interface characterAchievementStatisticsCategory {
    id: number;
    name: string;
    sub_categories?: characterAchievementStatisticsCategory[];
}

