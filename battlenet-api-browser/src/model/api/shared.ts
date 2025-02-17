/**
 * Various shared data structures from throughout the API
 */


export interface characterRef {
    key: hrefStruct;
    id: number;
    name: string;
    realm: realmStruct;
}

export interface factionStruct {
    type: string;
    name: string;
}

export interface genderStruct {
    type: string;
    name: string;
}

export interface guildCrestStruct {
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

export interface hrefStruct {
    href: string;
}

export interface idkeyStruct {
    id: number;
    key: hrefStruct;
}

export interface idNameStruct {
    id: number;
    name: string;
}

/**
 * At the top of practically every record.  Usually just contains self
 */
export interface linksStruct {
    self: hrefStruct;
    user?: hrefStruct;
    profile?: hrefStruct;
}


export interface moneyStruct {
    value: number;
    units: {
        gold: number;
        silver: number;
        copper: number;
    }
}

export interface realmStruct {
    id: number;
    name: string;
    key: hrefStruct;
    slug: string;
}

/**
 * A very common structure, typically used when needing a reference to something of another type
 */
export interface refStruct {
    id: number;
    name: string;
    key: hrefStruct;
}


export interface positionStruct {
    zone: idNameStruct;
    map: idNameStruct;
    x: number;
    y: number;
    z: number;
    facing: number;
}

/**
 * Media reference - id and key
 */
export interface mediaStruct {
    key: hrefStruct;
    id: number;
}

export interface assetStruct {
    key: string;
    value: string;
    file_data_id: number;
}

export interface spellTooltip {
    spell: refStruct;
    description: string;
    cast_time?: string;
    power_cost?: string;
    range?: string;
    cooldown?: string;
}

export interface regionedNameStruct {
    it_IT?: string,
    ru_RU?: string,
    en_GB?: string,
    zh_TW?: string,
    ko_KR?: string,
    en_US?: string,
    es_MX?: string,
    pt_BR?: string,
    es_ES?: string,
    zh_CN?: string,
    fr_FR?: string,
    de_DE?: string
}

export interface weaponStruct {
    damage: {
        min_value: number,
        max_value: number,
        display_string: string,
        damage_class: {
            type: string,
            name: string
        }
    },
    attack_speed: {
        value: number,
        display_string: string,
    },
    dps: {
        value: number,
        display_string: string,
    }
}

export interface itemStatStruct {
    type: {
        type: string,
        name: string
    },
    value: number,
    is_negated: boolean,
    display: {
        display_string: string,
        color: rgbaColorStruct,
    }
}

export interface rgbaColorStruct {
    r: number,
    g: number,
    b: number,
    a: number
}


/**
 * This is fairly standard across the API in "$thing Media" API calls
 */
export interface APIMediaStruct {
    _links: linksStruct;
    assets: assetStruct[];
    id: number;
}

/**
 * Most search APIs include these fields
 */
export interface APISearch {
    page: number;
    pageSize: number;
    maxPageSize: number;
    pageCount: number;
    results: APISearchResult[];
}

/**
 * Standard field across search results
 */
export interface APISearchResult {
    key: hrefStruct;
}