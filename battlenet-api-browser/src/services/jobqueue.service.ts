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
  _timer?: any = undefined;
  _maxConcurrent: number = 4;
  _concurrentCount: number = 0;

  constructor() { 
    this.start();
  }

  add(f: Function)
  {
    this.jobs.push(new jobQueueJob(this, f));
  }

  start()
  {
    if (this._timer === undefined)
    {
      this.run();
    }
    else
    {
      this._running = true;
    }
  }

  pause()
  {
    this._running = false;
  }

  kill()
  {
    this._running = false;
    this.jobs.length=0;
    clearInterval(this._timer);
    this._timer = undefined;
  }

  /**
   * How many jobs are queued
   * @returns 
   */
  size(): number
  {
    return this.jobs.length;
  }

  /**
   * How many jobs are currently executing
   * @returns
   */
  execCount(): number
  {
    return this._concurrentCount;
  }

  run() {
    this._running = true;
    this._timer = setInterval(
      async()=>{ 
        if (this._running && (this._concurrentCount < this._maxConcurrent) && (this.jobs.length > 0) )
        {
          //flag to prevent job overlap
          this._concurrentCount++;
          this.jobs.pop()?.exec().then(()=>{
            this._concurrentCount--;
          }).catch(()=>{
            //catch any failed promises
            this._concurrentCount--;
          })
        }
      },10);
  }
}
