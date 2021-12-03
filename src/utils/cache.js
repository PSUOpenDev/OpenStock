// Function helper to write to cache
export const writeToCache = (keyStorage, valueStorage) =>
    localStorage.setItem(keyStorage, JSON.stringify(valueStorage));

// Function helper to read from cache
export const readFromCache = (keyStorage) =>
    JSON.parse(localStorage.getItem(keyStorage)) || [];
