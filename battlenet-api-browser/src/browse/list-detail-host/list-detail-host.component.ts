import { ChangeDetectorRef, Component, ComponentRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ApiclientService } from '../../services/apiclient.service';
import { Subscription } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserdataService } from '../../services/userdata.service';
import { dataDoc, dataDocCollection, dataDocDetailsCollection } from '../../model/datastructs';
import { ActivatedRoute } from '@angular/router';
import { ListDataItemComponent } from '../../components/list-data-item/list-data-item.component';
import { Class } from '@badcafe/jsonizer';

enum ListDetailHostComponentMode
{
  Master, Detail
}

interface ListDetailHostComponentData
{
  list: string[], 
  listComponent?: Class, 
  detailComponent?: Class
}

@Component({
  selector: 'app-list-detail-host',
  imports: [
    ScrollingModule,
    ListDataItemComponent
  ],
  templateUrl: './list-detail-host.component.html',
  styleUrl: './list-detail-host.component.scss'
})
export class ListDetailHostComponent implements OnInit, OnDestroy{

  protected apiClient: ApiclientService = inject(ApiclientService);
  protected dataChangedSubscription?: Subscription;

  private ref: ChangeDetectorRef

  private id?: number;

  Mode = ListDetailHostComponentMode;
  protected mode: ListDetailHostComponentMode = ListDetailHostComponentMode.Master;
  protected data?: ListDetailHostComponentData;

  protected masterList?: dataDocCollection<any>;
  protected dataItem?: dataDoc;

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

  //things to do just before oninit
  preinit()
  {    this.id = undefined;
    var idstr = this.route.snapshot.paramMap.get('id');
    if (idstr !== null)
    {
      this.id = Number.parseInt(this.route.snapshot.paramMap.get('id')!);  
    }
    console.log("ID: "+this.id);
    //find reference from string passed in route data
    this.data = this.route.snapshot.data as ListDetailHostComponentData;
    var dataRef: string[] = this.data.list;
    console.log("Data: ("+dataRef[0]+"."+dataRef[1]+")");    
    this.masterList = (this.userData.data.apiData as any)[dataRef[0]][dataRef[1]];
    console.dir(this.masterList);  
    if (this.id === undefined)
    {
      this.mode = ListDetailHostComponentMode.Master;
    }        
    else
    {
      this.dataItem = (this.masterList as dataDocDetailsCollection<any,any>).ensureDetailEntry(this.apiClient,this.id);
      console.dir(this.dataItem);       
      this.mode = ListDetailHostComponentMode.Detail;
    }
    this.userData.setCurrent(this.masterList!);
    this.masterList!.checkLoaded(this.apiClient);    
    this.ref.detectChanges();    
  }

  //things to do just after init
  postinit()
  {
  }

  getMasterComponent()
  {
    //todo
  }

  getDetailComponent()
  {
    //todo
  }


}