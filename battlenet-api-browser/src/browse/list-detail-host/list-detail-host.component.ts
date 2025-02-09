import { ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { apiClientService } from '../../services/apiclient.service';
import { Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserdataService } from '../../services/userdata.service';
import { IApiDataDoc } from '../../model/datastructs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GenericMasterComponent } from './generic-master/generic-master.component';
import { GenericDetailComponent } from './generic-detail/generic-detail.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DataToolsComponent } from './data-tools/data-tools.component';
import { IMasterDetail } from '../../model/dbdatastructs';

enum ListDetailHostComponentMode
{
  Master, Detail
}


interface ListDetailHostComponentData
{
  list: string[], //path to the list under userData.data.apiData
  listComponent?: Type<any>, //optional component to use in place of list
  listPages?: { 
    title: string, 
    component: Type<any>
  }[], //optional additional tabs to add on list page
  detailComponent?: Type<any> //optional component to use in place of detail
  detailPages?: { 
    title: string,
    component: Type<any>
  }[], //optional additional tabs to add on detail page
  hideKey?: Boolean //option to hide key value from list
}

@Component({
  selector: 'app-list-detail-host',
  imports: [
    ScrollingModule,
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    GenericDetailComponent,
    DataToolsComponent
],
  templateUrl: './list-detail-host.component.html',
  styleUrl: './list-detail-host.component.scss'
})
export class ListDetailHostComponent implements OnInit, OnDestroy {

  protected apiClient: apiClientService = inject(apiClientService);

  //event subscriptions
  protected dataChangedSubscription?: Subscription;
  protected refreshSubscription?: Subscription;
  protected itemClickedSubscription?: Subscription;

  private ref: ChangeDetectorRef

  //id of current detail item
  private id?: number | string;

  Mode = ListDetailHostComponentMode;
  protected mode: ListDetailHostComponentMode = this.Mode.Master;

  //data passed from route
  protected data?: ListDetailHostComponentData;

  //references to current master/detail data
  protected masterList?: IMasterDetail;
  protected detailItem?: IApiDataDoc;

  //inputs and outputs to pass to override components
  protected masterInputs: Record<string, unknown> | undefined
  protected masterOutputs: Record<string, unknown> | undefined  
  protected detailInputs: Record<string, unknown> | undefined

  //event emitter for list items being clicked/selected
  public itemClickedEmitter?: EventEmitter<void>;

  constructor(protected userData: UserdataService, protected route: ActivatedRoute)
  {
    this.ref = inject(ChangeDetectorRef);
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
    this.dataChangedSubscription = this.userData.dataChangedEmitter.subscribe(()=>{ this.reload()});
    //catch refresh button
    this.refreshSubscription = this.userData.refreshRequestEmitter.subscribe(()=>{ this.refresh()});
    this.postinit();

  }

  /**
   * called when refresh button is pressed
   */
  refresh()
  {
    if (this.mode == this.Mode.Master)
    {
      this.masterList!.reload(this.apiClient).then((list)=>{
        this.userData.dataRefreshedEmitter.emit();
      });
    }
    else
    {
      this.masterList!.reloadItem(this.apiClient, this.id).then((rec)=>{
        this.detailItem = rec;
        this.userData.setCurrent(this.masterList!, this.detailItem!);
        this.mode = ListDetailHostComponentMode.Detail;
        this.detailInputs = { 'data': this.detailItem! };               
        this.userData.dataRefreshedEmitter.emit();
      });
    }
  }

  reload()
  {
    this.ref.detectChanges();
  }

  getValueByKey(key: any, obj: Object): any {
    return [].concat(key).reduce((o, k) => o[k], obj);
  }

  /**
   * things to do just before oninit
   */
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

    //Use presence (or lack thereof) of id to determine if we're showing master or detail
    if (this.id === undefined)
    {
      this.mode = ListDetailHostComponentMode.Master;
      this.userData.setCurrent(this.masterList!, undefined);
    }        
    else
    {
      this.masterList?.getRec(this.apiClient,this.id).then((rec)=>{
        this.detailItem = rec;
        this.userData.setCurrent(this.masterList!, this.detailItem!);
        this.mode = ListDetailHostComponentMode.Detail;
        this.detailInputs = { 'data': this.detailItem! };
        this.ref.detectChanges();           
      });
    }

    //set data and clicked emitter for master 
    this.masterInputs = { 'data': this.masterList!, 'clicked' : this.itemClickedEmitter };

    this.masterList!.checkLoaded(this.apiClient); 

    //load generic master components if needed
    if (!Object.hasOwn(this.data, "listComponent"))
    {
      this.data.listComponent = GenericMasterComponent;
    }
    this.ref.detectChanges(); 
  }

  /**
   * Called by Event Emitter for item clicked events.
   * Switches to the detail page.
   * @param item 
   */
  itemClicked(item: any)
  {
    this.id = (item as any)[this.masterList!.key]
    this.masterList?.getRec(this.apiClient,this.id!).then((rec)=>{
      this.detailItem = rec;
      this.mode = ListDetailHostComponentMode.Detail;
      this.detailInputs = { 'data': this.detailItem!, 'master': this.masterList };
      this.userData.setCurrent(this.masterList!, rec);
      window.history.pushState({}, '', this.masterList?.getIndexItemPath(item));
      this.ref.detectChanges();           
    });
  }

  /**
   * Switch back to master page
   */
  returnToMaster() {
    this.mode = this.Mode.Master;
    this.userData.setCurrent(this.masterList!, undefined);
    window.history.pushState({}, '', this.masterList!.path());
  }

  //things to do just after init
  postinit()
  {
  }



}