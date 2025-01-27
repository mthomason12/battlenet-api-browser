import { dataDoc, dataStruct, keyStruct, linksStruct, dataDetailDoc, dataDocDetailsCollection, mediaDataStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

interface realmType
{
  type: string;
  name: string;
}

interface realmRegion
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface realmData
{
  _links: linksStruct;
  id: number;
  region: realmRegion;
  connected_realm: keyStruct;
  name: string;
  category: string;
  locale: string;
  timezone: string;
  type: realmType;
  is_tournament: boolean;
  slug: string;
}

interface realmIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
  slug: string;
}

export interface realmIndex
{
  _links: linksStruct;
  realms: realmIndexEntry;
}

@Reviver<realmDataDetailDoc>({
  '.': Jsonizer.Self.assign(realmDataDetailDoc)
})
export class realmDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  region?: realmRegion;
  connected_realm?: keyStruct;
  category?: string;
  locale?: string;
  timezone?: string;
  type?: realmType;
  is_tournament?: boolean;
  slug?: string;

  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, id, name);
    this.key = 'slug';
  }

  override myPath(): string {
    return this.slug!;
  }  
}

@Reviver<realmDataDoc>({
  '.': Jsonizer.Self.endorse(realmDataDoc)
})
export class realmDataDoc extends dataDoc
{
  key?: keyStruct;
  slug?: string;
}

@Reviver<realmsDataDoc>({
  '.': Jsonizer.Self.assign(realmsDataDoc),
  items: {
    '*': realmDataDoc
  },
  details: {
    '*': realmDataDetailDoc
  }
})
export class realmsDataDoc extends dataDocDetailsCollection<realmDataDoc, realmDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Realms");
    this.icon = "emoji_events";
    this.dbkey = "wow-g-realms";
    this.thisType = realmsDataDoc;
    this.detailsType = realmDataDetailDoc;
    this.itemsName = "realms";
    this.key = "slug";
    this.stringKey = true;
}

  override getItems = function(apiClient: ApiclientService): Promise<realmIndex>
  {
    return apiClient.getRealmIndex() as Promise<realmIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, slug: string): Promise<realmData>
  {
    return apiClient.getRealm(slug) as Promise<realmData>;
  }
}