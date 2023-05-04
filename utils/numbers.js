export function number_with_thousands_seperator (i) {
    //parseFloat( i ).toFixed(2)
    return i.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

//parseFloat( i ).toFixed(2)
export function dollars_with_thousands_seperator (i) {
    //parseFloat( i ).toFixed(2)
    return `$ ${parseFloat( i ).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
}