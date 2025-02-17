/**
 * Covenants API Return Types
 * @module
 */

import { hrefStruct, idNameStruct, linksStruct, mediaStruct, refStruct, spellTooltip } from "../shared";

//region Covenants

/**
 * Covenants Index
 * 
 * /data/wow/covenants/index
 * 
 */
export interface APICovenantIndex {
  _links: linksStruct;
  covenants: APICovenantItem[];
}

export interface APICovenantItem {
  id: number;
  name: string;
  key: hrefStruct;
}

/**
 * Covenant
 * 
 * /data/wow/covenants/{covenantID}
 * 
 */
export interface APICovenant 
{
  _links: linksStruct;
  id: number;
  name: string;
  description?: string;
  signature_ability?: {
    id: number;
    spell_tooltip: spellTooltip;
  };
  class_abilities?: covenantClassAbility[];
  soulbinds?: refStruct[];
  renown_rewards?: {
    level: number;
    reward: refStruct;
  }[];
  media?: mediaStruct;
}

export interface covenantClassAbility
{
  id: number;
  playable_class: refStruct;
  spell_tooltip: spellTooltip;
}

//region Soulbinds

/**
 * Soulbind Index
 * 
 * /data/wow/soulbind/index
 * 
 */
export interface APISoulbindIndex {
    _links: linksStruct;
    soulbinds: refStruct[];
}

/**
 * Soulbind
 * 
 * /data/wow/soulbind/{soulbindID}
 * 
 */
export interface APISoulbind {
    _links: linksStruct;
    id: number;
    name: string;
    covenant: refStruct;
    creature: refStruct;
    follower: idNameStruct;
    talent_tree: refStruct;
}