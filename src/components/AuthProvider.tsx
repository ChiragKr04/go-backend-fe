import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { initializeAuth } = useAuth();

    useEffect(() => {
        // Initialize auth state from localStorage when app starts
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
};

export default AuthProvider; 