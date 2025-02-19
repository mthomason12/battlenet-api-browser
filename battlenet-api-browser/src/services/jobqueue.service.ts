import { Injectable } from '@angular/core';


/**
 * An individual job for JobQueueService
 */
class jobQueueJob<T = any>
{
  task: ()=>Promise<T>; //a task function needs to return a promise
  svc?: JobQueueService;
  signature: string;
  callbacks: ((v: T)=>void)[] = new Array();

  constructor(svc: JobQueueService, f: ()=>Promise<T>, signature: string = "", callback?: (v: T)=>void )
  {
    this.svc = svc;
    this.task = f;
    this.signature = signature;
    if (callback) {
      this.callbacks.push(callback);
    }
  }

  addCallback(callback: (v: T)=>void) {
    this.callbacks.push(callback);
  }

  async exec() : Promise<void>
  {
    var retval = this.task().then((ret)=>{ 
      this.callbacks.forEach((cb)=>{
        cb(ret);
      });
    });
    //check if we got a Promise back
    if (retval instanceof Promise) {
      return retval;
    } else {
      //make up a resolved promise if there isn't one
      return new Promise((resolve)=>{resolve()})
    }
  }

}


@Injectable({
  providedIn: 'root'
})
/**
 * Background task manager.  Maintains a queue of jobs and ensures only a specified number can execute
 * concurrently.
 */
export class JobQueueService {

  jobs: jobQueueJob[] = new Array();
  _running: boolean = false;
  _executing: boolean = false;
  _timer?: any = undefined;
  _maxConcurrent: number = 6;
  _concurrentCount: number = 0;

  constructor() { 
    this.start();
  }

  add<T = any>(f: ()=>Promise<T>, signature: string = "", callback?: (v: T)=>void)
  {
    //look for existing job with the same signature. If found, add the callback to that instead of creating a new job
    const existingJob = this.jobs.find((job)=>{ return (signature === job.signature) && (signature !== "") });
    if (existingJob) {
      if (callback)
        existingJob.addCallback(callback);
    } else {
      this.jobs.push(new jobQueueJob(this, f, signature, callback));
    }
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
