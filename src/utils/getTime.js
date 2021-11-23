export const SIX_HOURS = 2.16*10000000;

export const getExecutionTimeToNow = (start) => {
    let end = new Date().getTime();
    return end - start;
}