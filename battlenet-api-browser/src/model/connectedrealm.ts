import { dataDoc, dataStruct, keyStruct, linksStruct, dataDetailDoc, dataDocDetailsCollection, mediaDataStruct, hrefStruct, refStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

interface connectedRealmType
{
    type?: string;
    name?: string;
}

interface connectedRealmRealm
{
    id?: number;
    region?: refStruct;
    connected_realm?: hrefStruct;
    name?: string;
    category?: string;
    locale?: string;
    timezone?: string;
    type?: connectedRealmType;
    is_tournament?: boolean;
    slug?: string;
}

interface connectedRealmPopulation
{
    type?: string;
    name?: string;
}

interface connectedRealmStatus
{
    type?: string;
    name?: string;
}

export interface connectedRealmData
{
    _links?: linksStruct;
    id?: number;
    has_queue?: boolean;
    status?: connectedRealmStatus;
    population?: connectedRealmPopulation;
    realms?: connectedRealmRealm[];
    mythic_leaderboards?: hrefStruct;
    auctions?: hrefStruct;
}

export interface connectedRealmIndex
{
  _links: linksStruct;
  realms: hrefStruct[];
}

@Reviver<connectedRealmDataDetailDoc>({
  '.': Jsonizer.Self.assign(connectedRealmDataDetailDoc)
})
export class connectedRealmDataDetailDoc extends dataDetailDoc
{
    _links?: linksStruct;
    has_queue?: boolean;
    status?: connectedRealmStatus;
    population?: connectedRealmPopulation;
    realms?: connectedRealmRealm[];
    mythic_leaderboards?: hrefStruct;
    auctions?: hrefStruct;

  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, id, name);
  }

}

@Reviver<connectedRealmDataDoc>({
  '.': Jsonizer.Self.endorse(connectedRealmDataDoc)
})
export class connectedRealmDataDoc extends dataDoc
{
  href?: string;
}

@Reviver<connectedRealmsDataDoc>({
  '.': Jsonizer.Self.assign(connectedRealmsDataDoc),
  items: {
    '*': connectedRealmDataDoc
  },
  details: {
    '*': connectedRealmDataDetailDoc
  }
})
export class connectedRealmsDataDoc extends dataDocDetailsCollection<connectedRealmDataDoc, connectedRealmDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Connected Realms");
    this.icon = "hub";
    this.dbkey = "wow-g-connected-realms";
    this.thisType = connectedRealmsDataDoc;
    this.detailsType = connectedRealmDataDetailDoc;
    this.itemsName = "connected-realms";
    this.key = "id";
    this.stringKey = true;
}

  override getItems = function(apiClient: ApiclientService): Promise<connectedRealmIndex>
  {
    return apiClient.getConnectedRealmsIndex() as Promise<connectedRealmIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<connectedRealmData>
  {
    return apiClient.getConnectedRealm(id) as Promise<connectedRealmData>;
  }
}