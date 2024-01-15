import { useState, useEffect } from 'react';

// Function to check if window is available
const isWindowAvailable = typeof window !== 'undefined';

export const clearLocalStorageValue = (key: string) => {
    if (isWindowAvailable) {
        window.localStorage.removeItem(key);
    }
};

function useLocalStorage<T>(
    key: string,
    defaultValue: T
): [T, (value: T) => void] {
    // Function to get the value from localStorage or return default
    const getStoredValue = (): T => {
        if (!isWindowAvailable) {
            return defaultValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(error);
            return defaultValue;
        }
    };

    // State and setter for the value
    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    // Function to set the value in both state and localStorage
    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            if (isWindowAvailable) {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Effect to update state if the item in localStorage changes
    useEffect(() => {
        if (isWindowAvailable) {
            setStoredValue(getStoredValue());
        }
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
