import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserdataService } from '../../userdata/userdata.service';
import { ApiclientService } from '../../apiclient/apiclient.service';
import { dataStruct } from '../../model/datastructs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-abstract-browse-child',
  imports: [],
  templateUrl: './abstract-browse-child.component.html',
  styleUrl: './abstract-browse-child.component.scss'
})
export class AbstractBrowseChildComponent<T extends dataStruct> implements OnInit, OnDestroy{

  protected apiClient: ApiclientService = inject(ApiclientService);
  protected dataChangedSubscription?: Subscription;
  private ref: ChangeDetectorRef

  constructor(protected data: UserdataService)
  {
    this.ref = inject(ChangeDetectorRef);
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.dataChangedSubscription = this.data.dataChangedEmitter.subscribe(
      ()=>{
        this.ref.detectChanges();
      }
    );
    this.preinit();
    this.currentData().checkLoaded(this.apiClient);
    this.data.setCurrent(this.currentData());
  }

  //things to do just before oninit
  preinit()
  {
  }

  currentData(): T
  {
    return this.data.getCurrent() as T;
  }

  
}
