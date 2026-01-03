import dayjs from 'dayjs'

const formatMessage=(username,text)=>{
    const timestamp = Date.now();
    return {
        username,
        text,
        time:dayjs(timestamp).format('HH:mm')
    }
}

export default formatMessage