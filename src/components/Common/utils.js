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
