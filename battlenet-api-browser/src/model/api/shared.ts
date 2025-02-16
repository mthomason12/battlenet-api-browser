/**
 * Various shared data structures from throughout the API
 */


export interface linksStruct {
    self: hrefStruct;
    user?: hrefStruct;
    profile?: hrefStruct;
}

export interface idNameStruct {
    id: number;
    name: string;
}

export interface refStruct {
    id: number;
    name: string;
    key: hrefStruct;
}

export interface idkeyStruct {
    id: number;
    key: hrefStruct;
}

export interface genderStruct {
    type: string;
    name: string;
}

export interface factionStruct {
    type: string;
    name: string;
}

export interface realmStruct {
    id: number;
    name: string;
    key: hrefStruct;
    slug: string;
}

export interface hrefStruct {
    href: string;
}

export interface characterRef {
    key: hrefStruct;
    id: number;
    name: string;
    realm: realmStruct;
}

export interface positionStruct {
    zone: idNameStruct;
    map: idNameStruct;
    x: number;
    y: number;
    z: number;
    facing: number;
}

export interface mediaStruct {
    key: hrefStruct;
    id: number;
}

/**
 * This is fairly standard across the API in "$thing Media" API calls
 */
export interface mediaDataStruct {
    _links: linksStruct;
    assets: assetStruct[];
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

export interface regionedNameStruct  {
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

export interface APISearch {
    page: number;
    pageSize: number;
    maxPageSize: number;
    pageCount: number;
    results: APISearchResult[];
}

export interface APISearchResult {
    key: hrefStruct;
}