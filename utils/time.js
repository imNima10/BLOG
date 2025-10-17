module.exports = (updatedAt) => {
    let currentTime = new Date()
    let updatedAtTime = new Date(updatedAt)

    let differentTime = (currentTime - updatedAtTime)

    let secend = Math.floor(differentTime / 1000)

    if (secend < 60) {
        return `همین حالا`
    } else if (secend < 3600) {
        let min = Math.floor(secend / 60)
        return `${min} دقیقه پیش`
    } else {
        let hour = Math.floor(secend / 3600)
        if(hour<24){
            return `${hour} ساعت پیش`
        }else{
        let day = Math.floor(hour / 24)
            return `${day} روز پیش`
        }
    }
}