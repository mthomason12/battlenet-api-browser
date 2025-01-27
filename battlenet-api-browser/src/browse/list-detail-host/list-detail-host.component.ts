import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { ApiclientService } from '../../services/apiclient.service';
import { Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserdataService } from '../../services/userdata.service';
import { dataDoc, dataDocCollection, dataDocDetailsCollection } from '../../model/datastructs';
import { ActivatedRoute } from '@angular/router';
import { ListDataItemComponent } from '../../components/list-data-item/list-data-item.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

enum ListDetailHostComponentMode
{
  Master, Detail
}

interface ListDetailHostComponentData
{
  list: string[], 
  listComponent?: Type<any>, 
  detailComponent?: Type<any>
}

@Component({
  selector: 'app-list-detail-host',
  imports: [
    ScrollingModule,
    ListDataItemComponent,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './list-detail-host.component.html',
  styleUrl: './list-detail-host.component.scss'
})
export class ListDetailHostComponent implements OnInit, OnDestroy{

  protected apiClient: ApiclientService = inject(ApiclientService);
  protected dataChangedSubscription?: Subscription;

  private ref: ChangeDetectorRef

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

  constructor(protected userData: UserdataService, protected route: ActivatedRoute)
  {
    this.ref = inject(ChangeDetectorRef);
    console.log("Creating Component");
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.preinit();
    this.dataChangedSubscription = this.userData.dataChangedEmitter.subscribe(
      ()=>{
        this.reload();
      }
    );
    this.postinit();
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
    this.masterInputs = { 'data': this.masterList! };
    this.masterOutputs = { 'clicked' : this.itemClicked }
    this.userData.setCurrent(this.masterList!);
    this.masterList!.checkLoaded(this.apiClient); 
    if (this.id !== undefined)   
    {
      this.detailInputs = { 'data': this.detailItem! };
      this.detailItem!.checkLoaded(this.apiClient);
    }
    this.ref.detectChanges();    
  }

  itemClicked(id: any)
  {
    this.id = id;
    console.log(this.id);    
    this.detailItem = (this.masterList as dataDocDetailsCollection<any,any>).ensureDetailEntry(this.apiClient,this.id);     
    this.mode = ListDetailHostComponentMode.Detail;    
    this.detailInputs = { 'data': this.detailItem! };
    this.detailItem!.checkLoaded(this.apiClient); 
    window.history.pushState({}, '', this.detailItem!.path()); 
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