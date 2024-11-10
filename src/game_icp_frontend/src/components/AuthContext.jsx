import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authClient, setAuthClient] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [agent, setAgent] = useState(null);
    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        try {
            setIsLoading(true);
            const client = await AuthClient.create();
            setAuthClient(client);

            const isLoggedIn = await client.isAuthenticated();
            if (isLoggedIn) {
                const identity = client.getIdentity();
                initAgent(identity);
                setIsAuthenticated(true);
                setIdentity(identity);
                console.log(identity);
            }
        } catch (err) {
            console.error("Auth initialization failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const initAgent = (identity) => {
        const agent = new HttpAgent({
            identity,
            host: process.env.REACT_APP_IC_HOST || 'https://ic0.app'
        });

        if (process.env.NODE_ENV !== 'production') {
            agent.fetchRootKey().catch(console.error);
        }

        setAgent(agent);
    };

    const login = async () => {
        try {
            setIsLoading(true);
            await authClient?.login({
                identityProvider: process.env.REACT_APP_II_URL || 'https://identity.ic0.app/#authorize',
                onSuccess: () => {
                    const identity = authClient.getIdentity();
                    initAgent(identity);
                    setIsAuthenticated(true);
                    setIdentity(identity);
                },
            });
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authClient?.logout();
            setIsAuthenticated(false);
            setIdentity(null);
            setAgent(null);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            identity,
            agent,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};