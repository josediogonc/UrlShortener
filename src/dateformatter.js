const currentDateBrazil = () => {
    var date = new Date()
    var day  = date.getDate().toString()
    day = (day.length == 1) ? '0' + day : day
    var month  = (date.getMonth()+1).toString(),
    month = (month.length == 1) ? '0' + month : month
    let year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

module.exports = { currentDateBrazil }
