/**
 * Various shared data structures from throughout the API
 */

export interface linksStruct {
    self: hrefStruct;
    user?: hrefStruct;
    profile?: hrefStruct;
}

export interface idNameStruct
{
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

export interface characterRef{
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

export interface mediaStruct
{
  key: hrefStruct;
  id: number;
}
