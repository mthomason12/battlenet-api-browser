import { Injectable } from '@angular/core';


class jobQueueJob
{
  task: Function; //a task function needs to return a promise
  svc?: JobQueueService;

  constructor(svc: JobQueueService, f: Function)
  {
    this.svc = svc;
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
  _executing: boolean = false;
  _timer: any = undefined;

  constructor() { }

  add(f: Function)
  {
    this.jobs.push(new jobQueueJob(this, f));
  }

  start()
  {
    this._running = true;
    this.run();
  }

  pause()
  {
    this._running = false;
  }

  kill()
  {
    this._running = false;
    this.jobs.length=0;
  }

  size(): number
  {
    return this.jobs.length;
  }

  run() {
    this._running = true;
    this._timer = setInterval(
      async()=>{ 
        if (this._running && !this._executing)
        {
          //flag to prevent job overlap
          this._executing = true
          await this.jobs.pop()?.exec();
          this._executing = false;
        }
      },50);
  }
}
