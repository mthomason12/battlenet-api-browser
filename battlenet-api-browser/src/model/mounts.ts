import { dataDoc, dataStruct, keyStruct, linksStruct, dataDetailDoc, dataDocDetailsCollection, factionStruct, refStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

interface mountRequirementsStruct
{
  faction?: factionStruct;
  classes?: refStruct[];
}

interface mountDisplaysStruct
{
  key: keyStruct;
  id: number;
}

interface mountSourceStruct
{
  type: string;
  name: string;
}

export interface mountData
{
  _links: linksStruct;
  id: number;
  name?: string;
  description?: string;
  creature_displays?: mountDisplaysStruct[];
  source?: mountSourceStruct;
  faction?: factionStruct;
  requirements?: mountRequirementsStruct;
  should_exclude_if_uncollected?: boolean;
}

interface mountIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface mountsIndex
{
  _links: linksStruct;
  mounts: mountIndexEntry;
}

@Reviver<mountDataDetailDoc>({
  '.': Jsonizer.Self.endorse(mountDataDetailDoc)
})
export class mountDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  description?: string;
  creature_displays?: mountDisplaysStruct[];
  source?: mountSourceStruct;
  faction?: factionStruct;
  requirements?: mountRequirementsStruct;
  should_exclude_if_uncollected?: boolean;
}

@Reviver<mountDataDoc>({
  '.': Jsonizer.Self.endorse(mountDataDoc)
})
export class mountDataDoc extends dataDoc
{
  key?: keyStruct;
}

@Reviver<mountsDataDoc>({
  '.': Jsonizer.Self.assign(mountsDataDoc),
  items: {
    '*': mountDataDoc
  },
  details: {
    '*': mountDataDetailDoc
  }
})
export class mountsDataDoc extends dataDocDetailsCollection<mountDataDoc, mountDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Mounts");
    this.icon = "emoji_events";
    this.dbkey = "wow-g-mounts";
    this.thisType = mountsDataDoc;
    this.detailsType = mountDataDetailDoc;
    this.itemsName = "mounts";
}

  override getItems = function(apiClient: ApiclientService): Promise<mountsIndex>
  {
    return apiClient.getMountIndex() as Promise<mountsIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<mountData>
  {
    return apiClient.getMount(id) as Promise<mountData>;
  }
}