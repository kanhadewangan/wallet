import os from "os";

 const len =os.cpus().length;
 os.cpus().forEach((cpu, index) => {
    console.log(`CPU ${index + 1}: ${cpu.model}`);
 })
 
 const naem =os.freemem();
 const totalMemory = os.totalmem();
  const current = totalMemory - naem;
 console.log(`Total Memory: ${totalMemory} bytes`);
    console.log(`Free Memory: ${naem} bytes`);
    console.log(`Used Memory: ${current} bytes`);
   
const val = os.availableParallelism();
console.log(`Available Parallelism: ${val}`);
 
