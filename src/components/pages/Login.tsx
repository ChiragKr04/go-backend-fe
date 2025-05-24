import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { useAuth } from "../../hooks/useAuth"
import { useState, useEffect, useRef } from "react"

const Login = () => {
	const { goToHome, goToDashboard, goToSignup } = useAppNavigation()
	const { login, isLoading, error, isAuthenticated, clearError } = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const clearErrorRef = useRef(clearError)

	// Update ref when clearError changes
	useEffect(() => {
		clearErrorRef.current = clearError
	}, [clearError])

	// Redirect to dashboard if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			goToDashboard()
		}
	}, [isAuthenticated, goToDashboard])

	// Clear error when component unmounts
	useEffect(() => {
		return () => {
			clearErrorRef.current()
		}
	}, [])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!email || !password) {
			return
		}

		try {
			const result = await login({ email, password })
			if (result.type === 'auth/login/fulfilled') {
				// Login successful, useEffect will handle redirect
				console.log("Login successful!")
			}
		} catch (error) {
			console.error("Login error:", error)
		}
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
				{/* Left Side - Image */}
				<div className="hidden lg:flex items-center justify-center bg-muted p-8">
					<div className="max-w-md space-y-6 text-center">
						<div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
							<img
								src="/src/assets/hero-image.png"
								alt="Collaborative Coding Platform"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="space-y-2">
							<h2 className="text-2xl font-bold">Code together, anywhere</h2>
							<p className="text-muted-foreground">
								Join thousands of developers collaborating in real-time with CodeHall's powerful platform.
							</p>
						</div>
					</div>
				</div>

				{/* Right Side - Login Form */}
				<div className="flex items-center justify-center p-8">
					<div className="w-full max-w-md space-y-6">
						{/* Logo and Brand */}
						<div className="flex items-center justify-center gap-3 mb-8 cursor-pointer" onClick={goToHome}>
							<div className="w-6 h-6">
								<img src="/src/assets/logo.svg" alt="CodeHall Logo" className="w-full h-full" />
							</div>
							<span className="text-xl font-bold">CodeHall</span>
						</div>

						{/* Login Card */}
						<Card className="w-full">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl text-center">Welcome back</CardTitle>
								<p className="text-center text-muted-foreground">
									Sign in to your account to continue
								</p>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* GitHub Login Button */}
								<Button
									variant="outline"
									className="w-full h-11"
									onClick={() => {
										// GitHub OAuth integration would go here
										console.log("GitHub login clicked")
										// For now, just redirect to dashboard
										goToDashboard()
									}}
								>
									<svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
									</svg>
									Continue with GitHub
								</Button>

								{/* Divider */}
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<Separator className="w-full" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-background px-2 text-muted-foreground">
											Or continue with email
										</span>
									</div>
								</div>

								{/* Error Display */}
								{error && (
									<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
										{error}
									</div>
								)}

								{/* Email and Password Form */}
								<form className="space-y-4" onSubmit={handleLogin}>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => {
												setEmail(e.target.value)
											}}
											required
											disabled={isLoading}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											type="password"
											placeholder="Enter your password"
											value={password}
											onChange={(e) => {
												setPassword(e.target.value)
											}}
											required
											disabled={isLoading}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<input
												id="remember"
												type="checkbox"
												className="rounded border-border"
											/>
											<Label htmlFor="remember" className="text-sm font-normal">
												Remember me
											</Label>
										</div>
										<a
											href="#"
											className="text-sm font-medium text-primary hover:underline cursor-pointer"
										>
											Forgot password?
										</a>
									</div>
									<Button
										type="submit"
										className="w-full h-11"
										disabled={isLoading || !email || !password}
									>
										{isLoading ? "Signing in..." : "Sign in"}
									</Button>
								</form>

								{/* Sign up link */}
								<p className="text-center text-sm text-muted-foreground">
									Don't have an account?{" "}
									<button
										onClick={goToSignup}
										className="font-medium text-primary hover:underline bg-transparent border-none cursor-pointer"
									>
										Sign up
									</button>
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login 