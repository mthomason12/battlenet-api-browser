/**
 * Character Statistics API
 * @module
 */

import { linksStruct, refStruct, characterRef } from "../shared";

/**
 * Character Statistics Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/statistics 
 */
export interface APICharacterStatisticsSummary {
    _links: linksStruct;
    health: number;
    power: number;
    power_type: refStruct;
    speed: {
        rating: number;
        rating_bonus: number;
    }
    strength: {
        base: number;
        effective: number;
    }
    agility: {
        base: number;
        effective: number;
    }
    intellect: {
        base: number;
        effective: number;
    }
    stamina: {
        base: number;
        effective: number;
    }
    melee_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    melee_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    mastery: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    bonus_armor: number;
    lifesteal: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    versatility: number;
    versatility_damage_done_bonus: number;
    versatility_healing_done_bonus: number;
    versatility_damage_taken_bonus: number;
    avoidance: {
        rating: number;
        rating_bonus: number;
    }
    attack_power: number;
    main_hand_damage_min: number;
    main_hand_damage_max: number;
    main_hand_speed: number;
    main_hand_dps: number;
    off_hand_damage_min: number;
    off_hand_damage_max: number;
    off_hand_speed: number;
    off_hand_dps: number;
    spell_power: number;
    spell_penetration: number;
    spell_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    mana_regen: number;
    mana_regen_combat: number;
    armor: {
        base: number;
        effective: number;
    }
    dodge: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    parry: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    block: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    ranged_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    ranged_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    spell_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    character: characterRef;
}