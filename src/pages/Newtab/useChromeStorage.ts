import { useState, useEffect } from 'react';

const useChromeStorage = <T>(key: string, defaultValue: T): [T, (newValue: T) => void] => {
    const [value, setValue] = useState<T>(defaultValue);

    // Function to update the state and the chrome storage
    const setStorageValue = (newValue: T): void => {
        setValue(newValue);
        chrome.storage.local.set({ [key]: newValue });
    };

    // Function to get data from chrome storage
    const getStorageValue = (): void => {
        chrome.storage.local.get([key], (result: { [key: string]: T }) => {
            if (result[key] !== undefined) {
                setValue(result[key]);
            }
        });
    };

    // Listen to changes in chrome storage
    useEffect(() => {
        const onChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string): void => {
            if (area === 'local' && changes[key]) {
                setValue(changes[key].newValue as T);
            }
        };

        chrome.storage.onChanged.addListener(onChange);
        getStorageValue();

        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key]);

    return [value, setStorageValue];
};

export default useChromeStorage;