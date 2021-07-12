export function parseDate(dateString: string) {

    if( dateString === undefined){
        return  null;
    }else {
        if (dateString.includes('/')) {
            const str = dateString.split('/');

            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);

            return new Date(year, month, date);
        } else {
            return null;
        }
    }
}

export function verifyDate(start: Date, end: Date){
    return start <= end;
}
