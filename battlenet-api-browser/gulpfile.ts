import { exec } from "node:child_process";

export function build(callback: Function) {
    exec("ng build", (error, stdout, stderr)=>{
        console.log(stdout);
        console.log(stderr);
        callback();
    });
 }
 