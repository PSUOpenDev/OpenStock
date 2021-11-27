export const isExpired = (pastTime, currentTime, duration) => {
    return currentTime - pastTime > duration;
};
export const timestampToDate = (timestamp) => {
    return new Date(timestamp * 1000);
};

export const dateToTimestamp = (date) => {
    return Math.floor(date.getTime() / 1000);
};
export const durationInMilliseconds = (day, hours, minutes, seconds) => {
    return (
        day * 24 * 3600 * 100 +
        hours * 3600 * 100 +
        minutes * 60 * 100 +
        seconds * 100
    );
};
export const getStringOfDurationFromCurrentTo = (comparedDate) => {
    const allKinds = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "5y"];
    let choosePeriod = "";
    for (const period of allKinds) {
        const date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        switch (period) {
            case "1d":
                date.setDate(date.getDate() - 1);
                break;
            case "5d":
                date.setDate(date.getDate() - 5);
                break;
            case "1mo":
                date.setMonth(date.getMonth() - 1);
                break;
            case "3mo":
                date.setMonth(date.getMonth() - 3);
                break;
            case "6mo":
                date.setMonth(date.getMonth() - 6);
                break;
            case "1y":
                date.setYear(date.getYear() - 1);
                break;
            case "5y":
                date.setYear(date.getYear() - 5);
                break;
            default:
                break;
        }

        if (date < comparedDate) {
            choosePeriod = period;
            break;
        }
    }
    return choosePeriod;
};


export const getDateOfDurationString = (durationString) => {
    console.log(durationString);
    const date = new Date();
    console.log("date", date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    console.log("date 2", date);
    switch (durationString) {
        case "1d":
            date.setDate(date.getDate() - 1);
            break;
        case "5d":
            date.setDate(date.getDate() - 5);
            break;
        case "1mo":
            date.setMonth(date.getMonth() - 1);
            break;
        case "3mo":
            date.setMonth(date.getMonth() - 3);
            break;
        case "6mo":
            date.setMonth(date.getMonth() - 6);
            break;
        case "1y":
            date.setYear(date.getYear() - 1);
            break;
        case "5y":
            date.setYear(date.getYear() - 5);
            break;
        default:
            break;
    }
    return date;
};
