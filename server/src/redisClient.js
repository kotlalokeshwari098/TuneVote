const redis=require('redis')

const redisClient=redis.createClient({
  socket:{
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
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


module.exports = redisClient ;