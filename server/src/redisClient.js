import redis from 'redis';

const redisClient=redis.createClient({
  socket:{
    host:process.env.REDIS_HOST || "redis",
    port:process.env.REDIS_PORT || 6379
  }
});


(async ()=>{
  
  redisClient.on('error',(err)=>{
    console.error("Redis client error",err)
  })

  redisClient.on('ready',()=>{
    console.log("Redis client started!")
  })

  await redisClient.connect();

  const response=await redisClient.ping();
  console.log(response)

})();


export default redisClient;