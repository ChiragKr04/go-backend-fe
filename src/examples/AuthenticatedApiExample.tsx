// Example component showing how to use auth state and make authenticated API calls
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../constants/api';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AuthenticatedApiExample = () => {
    const { user, token, isAuthenticated, logout } = useAuth();
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Example of making an authenticated API call
    const fetchProtectedData = async () => {
        if (!isAuthenticated) {
            console.log('User not authenticated');
            return;
        }

        setLoading(true);
        try {
            // Example API call - replace with your actual endpoint
            const data = await api.get('http://localhost:3000/api/v1/protected-endpoint');
            setApiData(data);
            console.log('Protected data fetched:', data);
        } catch (error) {
            console.error('Failed to fetch protected data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Example of making a POST request with auth
    const postData = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await api.post('http://localhost:3000/api/v1/some-endpoint', {
                message: 'Hello from authenticated user!',
                userId: user?.id,
            });
            console.log('POST response:', response);
        } catch (error) {
            console.error('POST request failed:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4">
                <p>Please log in to see authenticated content.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Authenticated User</h2>

            {/* Display user info */}
            <div className="mb-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">User Info:</h3>
                <p>Name: {user?.first_name} {user?.last_name}</p>
                <p>Email: {user?.email}</p>
                <p>ID: {user?.id}</p>
            </div>

            {/* Display token (first 20 chars for security) */}
            <div className="mb-4 p-4 bg-blue-50 rounded">
                <h3 className="font-semibold">Token (partial):</h3>
                <p className="text-sm font-mono">{token?.substring(0, 20)}...</p>
            </div>

            {/* API call examples */}
            <div className="space-y-3">
                <Button
                    onClick={fetchProtectedData}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Loading...' : 'Fetch Protected Data'}
                </Button>

                <Button
                    onClick={postData}
                    variant="outline"
                    className="w-full"
                >
                    Post Data
                </Button>

                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                >
                    Logout
                </Button>
            </div>

            {/* Display API data if available */}
            {apiData && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                    <h3 className="font-semibold">API Response:</h3>
                    <pre className="text-sm">{JSON.stringify(apiData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AuthenticatedApiExample; 