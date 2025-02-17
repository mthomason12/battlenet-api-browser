/**
 * Journal API Return Types
 */

import { APIMediaStruct, APISearch, APISearchResult, idNameStruct, linksStruct, mediaStruct, refStruct, regionedNameStruct } from "./shared";

//region Journal Expansions

/**
 * Journal Expansions Index
 * /data/wow/journal-expansion/index
 */
export interface APIJournalExpansionsIndex {
    _links: linksStruct;
    tiers: refStruct[];
}

/**
 * Journal Expansion
 * /data/wow/journal-expansion/{journalExpansionId}
 */
export interface APIJournalExpansion {
    _links?: linksStruct;
    id: number;
    name: string;
    dungeons: refStruct[];
}


//region Journal Encounters

/**
 * Journal Encounters Index
 * /data/wow/journal-encounter/index
 */
export interface APIJournalEncountersIndex {
    _links: linksStruct;
    encounters: refStruct[];
}

/**
 * Journal Encounter
 * /data/wow/journal-encounter/{journalEncounterId}
 */
export interface APIJournalEncounter {
    _links: linksStruct;
    id: number;
    name: string;
    description?: string;
    creatures: journalEncounterCreature[];
    items: journalEncounterItem[];
    sections: journalEncounterSection[];
    instance: refStruct;
    category: {
        type: string;
    };
    modes: journalEncounterMode[]
}

interface journalEncounterCreature {
    id?: number;
    name?: string;
    creature_display?: mediaStruct;
}

interface journalEncounterItem {
    id?: number;
    item?: refStruct;
}

interface journalEncounterSection {
    id?: number;
    title?: string;
    body_text?: string;
    sections?: journalEncounterSection[];
    creature_display?: mediaStruct;
}

interface journalEncounterMode {
    type?: string;
    name?: string;
}

/**
 * Journal Encounter Search
 * /data/wow/search/journal-encounter
 * 
 */
export interface APIJournalEncounterSearch extends APISearch {
    results: APIJournalEncounterSearchItem[];
}

export interface APIJournalEncounterSearchItem extends APISearchResult {
    data: {
        instance: {
            name: regionedNameStruct;
            id: number;
        }
        modes: journalEncounterSearchMode[];
        creatures: journalEncounterSearchCreature[];
        id: number;
        name: regionedNameStruct;
        category: {
            type: string;
        }
        items: journalEncounterSearchItem[];
        sections: journalEncounterSearchSection[];
    }
}

interface journalEncounterSearchMode {
    type: string;
    name: regionedNameStruct;
}

interface journalEncounterSearchCreature {
    id: number;
    name: regionedNameStruct;
    creature_display?: mediaStruct;
}

interface journalEncounterSearchItem {
    item: {
        name: regionedNameStruct;
        id: number;
    }
    id: number;
}

interface journalEncounterSearchSection {
    id: number;
    title: regionedNameStruct;
    sections: journalEncounterSearchSection[];
}

//region Journal Instances

/**
 * Journal Instances Index
 * /data/wow/journal-instance/index
 */
export interface APIJournalInstancesIndex {
    _links: linksStruct;
    Instances: refStruct[];
}

/**
 * Journal Instance
 * /data/wow/journal-instance/{journalInstanceId}
 */
export interface APIJournalInstance {
    _links?: linksStruct;
    name: string;
    map?: idNameStruct;
    area?: idNameStruct;
    description?: string;
    encounters?: refStruct[];
    media?: mediaStruct;
    minimum_level: number;
    category: {
        type: string;
    }
    order_index: number;
}

/**
 * Journal Instance Media
 * /data/wow/media/journal-instance/{journalInstanceId}
 */
export interface APIJournalInstanceMedia extends APIMediaStruct {
}

