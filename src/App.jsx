import React, { Suspense, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// 1. FIXED THE IMPORT: Import the context object, not the provider
import { userDataContext } from './Context/userContext.jsx';

// Lazy loaded components for code splitting
const SignIn = React.lazy(() => import('./pages/SignIn.jsx'));
const SignUp = React.lazy(() => import('./pages/SignUp.jsx'));
const Customize = React.lazy(() => import('./pages/Customize.jsx'));
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Customize2 = React.lazy(() => import('./pages/Customize2.jsx'));

function App() {
    // 2. USE THE LOADING STATE from the context
    const { userData, loading } = useContext(userDataContext);

    // 3. RENDER A LOADING INDICATOR while the user's status is being checked
    if (loading) {
        return (
            <div className='w-full h-[100vh] flex items-center justify-center text-white bg-gray-900'>
                Initializing...
            </div>
        );
    }

    // 4. ONCE LOADING IS FALSE, render the routes based on whether userData exists
    return (
        <Suspense fallback={<div className='w-full h-[100vh] flex items-center justify-center text-white bg-gray-900'>Loading Page...</div>}>
            <Routes>
                <Route
                    path="/"
                    element={
                        userData ? (
                            (userData.user?.assistantImage && userData.user?.assistantName) ? (
                                <Home />
                            ) : (
                                <Navigate to="/customize" />
                            )
                        ) : (
                            <Navigate to="/signin" />
                        )
                    }
                />
                <Route
                    path="/signin"
                    element={!userData ? <SignIn /> : <Navigate to="/" />}
                />
                <Route
                    path="/signup"
                    element={!userData ? <SignUp /> : <Navigate to="/" />}
                />
                <Route
                    path="/customize"
                    element={userData ? <Customize /> : <Navigate to="/signin" />}
                />
                <Route
                    path="/customize2"
                    element={userData ? <Customize2 /> : <Navigate to="/signin" />}
                />
            </Routes>
        </Suspense>
    );
}

export default App;