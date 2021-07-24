export function parseDate(dateString: string) {

    console.log("date: "+dateString);
    if( dateString === undefined){
        return  null;
    }else {
        return new Date(dateString);
    }
}

export function verifyDate(start: Date, end: Date){
    return start <= end;
}
