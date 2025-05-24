import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppNavigation } from '../hooks/useAppNavigation';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const { goToLogin } = useAppNavigation();
	const [hasInitialized, setHasInitialized] = useState(false);

	useEffect(() => {
		// Give a brief moment for auth state to initialize from localStorage
		const timer = setTimeout(() => {
			setHasInitialized(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		// Only redirect if we've given time for initialization and we're not loading
		if (hasInitialized && !isLoading && !isAuthenticated) {
			goToLogin();
		}
	}, [isAuthenticated, isLoading, goToLogin, hasInitialized]);

	// Show loading while checking authentication or during initialization
	if (isLoading || !hasInitialized) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
					<p className="text-muted-foreground">Verifying authentication...</p>
				</div>
			</div>
		);
	}

	// If not authenticated, don't render children (redirect will happen in useEffect)
	if (!isAuthenticated) {
		return null;
	}

	// If authenticated, render the protected content
	return <>{children}</>;
};

export default ProtectedRoute; 