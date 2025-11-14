
export const generateUniqueId=(name:string)=>{
   const res=name.slice(0,3).toLocaleUpperCase();
    const date=Date.now()
    const result2=date.toString().slice(-5);
    const generateRandomNumber=Math.floor(Math.random()*100);
    const result1=res.concat("--").concat(result2).concat("--");
    return result1+generateRandomNumber;

}
generateUniqueId("bad vibezz");