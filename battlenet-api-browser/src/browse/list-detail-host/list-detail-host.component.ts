import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { ApiclientService } from '../../services/apiclient.service';
import { Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserdataService } from '../../services/userdata.service';
import { dataDoc, dataDocCollection, dataDocDetailsCollection } from '../../model/datastructs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GenericMasterComponent } from './generic-master/generic-master.component';
import { GenericDetailComponent } from './generic-detail/generic-detail.component';

enum ListDetailHostComponentMode
{
  Master, Detail
}

interface ListDetailHostComponentData
{
  list: string[], //path to the list under userData.data.apiData
  listComponent?: Type<any>, //optional component to use in place of list
  detailComponent?: Type<any> //optional component to use in place of detail
  hideKey?: Boolean //option to hide key value from list
}

@Component({
  selector: 'app-list-detail-host',
  imports: [
    ScrollingModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './list-detail-host.component.html',
  styleUrl: './list-detail-host.component.scss'
})
export class ListDetailHostComponent implements OnInit, OnDestroy {

  protected apiClient: ApiclientService = inject(ApiclientService);
  protected dataChangedSubscription?: Subscription;
  protected refreshSubscription?: Subscription;
  protected itemClickedSubscription?: Subscription;

  private ref: ChangeDetectorRef

  //id of current detail item
  private id?: number | string;

  Mode = ListDetailHostComponentMode;
  protected mode: ListDetailHostComponentMode = ListDetailHostComponentMode.Master;
  protected data?: ListDetailHostComponentData;

  //references to current master/detail data
  protected masterList?: dataDocCollection<any>;
  protected detailItem?: dataDoc;

  //inputs and outputs to pass to override components
  protected masterInputs: Record<string, unknown> | undefined
  protected masterOutputs: Record<string, unknown> | undefined  
  protected detailInputs: Record<string, unknown> | undefined

  public itemClickedEmitter?: EventEmitter<void>;

  constructor(protected userData: UserdataService, protected route: ActivatedRoute)
  {
    this.ref = inject(ChangeDetectorRef);
    console.log("Creating Component");
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
    this.itemClickedSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    /** Event triggered when user selection is changed */
    this.itemClickedEmitter = new EventEmitter<any>();
    this.itemClickedSubscription = this.itemClickedEmitter.subscribe((event)=>{this.itemClicked(event)});

    this.preinit();
    //catch data reloads
    this.dataChangedSubscription = this.userData.dataChangedEmitter.subscribe(this.reload());
    //catch refresh button
    this.refreshSubscription = this.userData.refreshRequestEmitter.subscribe(this.refresh());
    this.postinit();

  }

  //called when refresh button is pressed
  refresh()
  {
    if (this.mode == this.Mode.Master)
    {
      this.masterList?.reload(this.apiClient);
    }
    else
    {
      (this.masterList as dataDocDetailsCollection<any,any>).reloadItem(this.apiClient, this.id)
    }
  }

  reload()
  {
    this.ref.detectChanges();
  }

  getValueByKey(key: any, obj: Object): any {
    return [].concat(key).reduce((o, k) => o[k], obj);
  }

  //things to do just before oninit
  preinit()
  {    
    this.id = undefined;
    var idstr = this.route.snapshot.paramMap.get('id');

    //find reference from string passed in route data
    this.data = this.route.snapshot.data as ListDetailHostComponentData;
    this.masterList = this.getValueByKey(this.data.list, this.userData.data.apiData);
    if (this.masterList!.stringKey)
    {
      if (idstr!.length > 0)
      {
        this.id = idstr!;
      }
    }
    else
    {
      if (idstr !== null)
      {
        this.id = Number.parseInt(this.route.snapshot.paramMap.get('id')!); 
        if (isNaN(this.id)) this.id = undefined;
      }
    }

    if (this.id === undefined)
    {
      this.mode = ListDetailHostComponentMode.Master;
    }        
    else
    {
      this.detailItem = (this.masterList as dataDocDetailsCollection<any,any>).ensureDetailEntry(this.apiClient,this.id);     
      this.mode = ListDetailHostComponentMode.Detail;
    }

    //set data and clicked emitter for master 
    this.masterInputs = { 'data': this.masterList!, 'clicked' : this.itemClickedEmitter };
    
    this.userData.setCurrent(this.masterList!);
    this.masterList!.checkLoaded(this.apiClient); 

    //set data if we have a detail id
    if (this.id !== undefined)   
    {
      //set data for details
      this.detailInputs = { 'data': this.detailItem! };
      (this.masterList as dataDocDetailsCollection<any,any>).checkItemLoaded(this.apiClient, this.id);
    }

    //load generic master and detail components
    if (!Object.hasOwn(this.data, "detailComponent"))
      {
        this.data.listComponent = GenericDetailComponent;
      }
    if (!Object.hasOwn(this.data, "listComponent"))
      {
        this.data.listComponent = GenericMasterComponent;
      }
    this.ref.detectChanges();    
  }

  itemClicked(item: any)
  {
    this.id = (item as any)[this.masterList!.key]
    this.detailItem = (this.masterList as dataDocDetailsCollection<any,any>).ensureDetailEntry(this.apiClient,this.id);     
    this.mode = ListDetailHostComponentMode.Detail;    
    this.detailInputs = { 'data': this.detailItem! };
    this.detailItem!.checkLoaded(this.apiClient); 
    window.history.pushState({}, '', this.detailItem?.path()); 
    this.ref.detectChanges();  
  }

  returnToMaster() {
    this.mode = this.Mode.Master;
    window.history.pushState({}, '', this.masterList!.path());
  }

  //things to do just after init
  postinit()
  {
  }



}