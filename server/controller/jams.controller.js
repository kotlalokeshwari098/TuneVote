const ApiResponse = require("../utils/ApiResponse")
const QRCode =require("qrcode")


const createQRCode=async(req,res)=>{
    const {url}=req.body;
    console.log(url)
    try {
        const response=await QRCode.toDataURL(url); 
        // console.log(response)
        return res.status(200).json(new ApiResponse(201,true,"QRCode generated!!",response))
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json(new ApiResponse(500,false,"Internal Server Error"));
    }
}

module.exports={createQRCode}