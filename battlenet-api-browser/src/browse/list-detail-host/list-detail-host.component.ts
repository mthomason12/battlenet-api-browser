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
  list: dataDocCollection<any>, 
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

  constructor(protected userData: UserdataService, protected route: ActivatedRoute)
  {
    this.ref = inject(ChangeDetectorRef);
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
    this.id = undefined;
    var idstr = this.route.snapshot.paramMap.get('id');
    if (idstr !== null)
    {
      this.id = Number.parseInt(this.route.snapshot.paramMap.get('id')!);  
    }
    this.data = this.route.snapshot.data as ListDetailHostComponentData;

    this.mode = ListDetailHostComponentMode.Detail;
    this.currentData().checkLoaded(this.apiClient);
    this.userData.setCurrent(this.currentData());
    if (this.currentDetail() != undefined)
    {
      this.mode = ListDetailHostComponentMode.Master;
    }    
    this.ref.detectChanges();
  }

  //things to do just before oninit
  preinit()
  {
    this.reload();
  }

  //things to do just after init
  postinit()
  {
  }

  currentData(): dataDocCollection<any>
  {
    return this.userData.getCurrent() as dataDocCollection<any>;
  }

  currentDetail(): dataDoc | undefined
  {
    if (this.id !== undefined)
    {
      return (this.currentData() as dataDocDetailsCollection<any,any>).getDetailEntry(this.id);
    }
    else
    {
      return undefined;
    }
  }

}