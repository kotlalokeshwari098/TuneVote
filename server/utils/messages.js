const dayjs=require('dayjs')

const formatMessage=(username,text)=>{
    return {
        username,
        text,
        time:dayjs().format('HH:mm')
    }
}

module.exports=formatMessage