/* Function to get the current date */
export const currentDate = () => {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

export const getThreeDaysAgo = () => {
    let today = new Date();
    let ret = today.setDate(today.getDate() - 3);
    return ret;
}