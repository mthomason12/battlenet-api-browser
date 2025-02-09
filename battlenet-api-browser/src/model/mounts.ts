import { dataStruct, keyStruct, linksStruct, factionStruct, refStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

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

export interface mountData extends IApiDataDoc
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

export interface mountsIndex extends IApiIndexDoc
{
  _links: linksStruct;
  mounts: mountIndexEntry;
}

export class mountsDataDoc extends dbData<mountsIndex, mountData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "bedroom_baby";
    this.type = "mounts";
    this.itemsName = "mounts";
    this.title = "Mounts";
}

  override getAPIIndex = function(apiClient: apiClientService): Promise<mountsIndex>
  {
    return apiClient.getMountIndex() as Promise<mountsIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<mountData>
  {
    return apiClient.getMount(id) as Promise<mountData>;
  }
}