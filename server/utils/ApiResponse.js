class ApiResponse{
   constructor(statusCode,success,message,data=""){
        this.status=statusCode,
        this.success=success,
        this.message=message
        this.data=data
  }
}

module.exports=ApiResponse
