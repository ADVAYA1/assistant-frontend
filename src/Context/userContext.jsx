import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

// 1. RENAMED component to UserContextProvider and made it a NAMED EXPORT
export function UserContextProvider({ children }) {

    // 2. FIXED the hardcoded URL to use environment variables for production
    const serverUrl =  "http://localhost:8000" ||import.meta.env.VITE_API_URL ;

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // 3. ADDED a loading state

    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
            setUserData(result.data);
        } catch (error) {
            console.error("Error fetching current user:", error.message);
        } finally {
            setLoading(false); // Stop loading after the check is done
        }
    };

    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.log("Error getting Gemini response:", error);
        }
    };

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value = {
        userData,
        setUserData,
        loading,
        getGeminiResponse,
        serverUrl,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage
    };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}