import { Injectable } from '@angular/core';


class jobQueueJob
{
  task: Function; //a task function needs to return a promise

  constructor(svc: JobQueueService, f: Function)
  {
    this.task = f;
  }

  async exec() : Promise<void>
  {
    return this.task();
  }
}

@Injectable({
  providedIn: 'root'
})
export class JobQueueService {

  jobs: jobQueueJob[] = new Array();
  _running: boolean = false;

  constructor() { }

  add(f: Function)
  {
    this.jobs.push(new jobQueueJob(this, f));
  }

  run() {
    this._running = true;
    while (this._running)
    {
      setTimeout(
        async()=>{ 
          await this.jobs.pop()?.exec();
         }
      ,5);
    }
  }
}
