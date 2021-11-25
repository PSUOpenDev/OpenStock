export const writeToCache = (keyStorage, valueStorage) =>
    localStorage.setItem(keyStorage, JSON.stringify(valueStorage));

export const readFromCache = (keyStorage) =>
    JSON.parse(localStorage.getItem(keyStorage)) || [];
