import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppNavigation } from "../../hooks/useAppNavigation"
import { useAuth } from "../../hooks/useAuth"
import { Users, Lock, Plus, User, LogOut } from "lucide-react"
import JoinRoomModal from "../modals/JoinRoomModal"
import CreateRoomModal from "../modals/CreateRoomModal"
import { roomService } from "../../services/roomService"
import { logger } from "../../utils/logger"
import type { CreateRoomRequest } from "../../types/room"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Dashboard = () => {
	const { goToHome } = useAppNavigation()
	const { user, logout, isAuthenticated, isLoading } = useAuth()
	const navigate = useNavigate()
	const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
	const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false)
	const [isCreatingRoom, setIsCreatingRoom] = useState(false)
	const [isJoiningRoom, setIsJoiningRoom] = useState(false)

	// Debug logging
	useEffect(() => {
		logger.info('Dashboard - Auth State:', {
			user,
			isAuthenticated,
			isLoading,
			userUsername: user?.username,
			userFirstName: user?.first_name,
			userEmail: user?.email
		});
	}, [user, isAuthenticated, isLoading]);

	const handleCreatePublicRoom = () => {
		setIsCreateRoomModalOpen(true)
	}

	const handleCreateRoomSubmit = async (roomData: CreateRoomRequest) => {
		try {
			setIsCreatingRoom(true)
			logger.info("Creating public room with data:", roomData)

			const newRoom = await roomService.createRoom(roomData)
			logger.info("Room created successfully:", newRoom)

			// Close the modal
			setIsCreateRoomModalOpen(false)

			// Navigate to the room page with room data
			navigate(`/room/${newRoom.room_id}`, {
				state: { room: newRoom },
				replace: false
			})
		} catch (error) {
			logger.error("Failed to create room:", error)
			// TODO: Show error toast/notification
			alert(`Failed to create room: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			setIsCreatingRoom(false)
		}
	}

	const handleCloseCreateRoomModal = () => {
		setIsCreateRoomModalOpen(false)
	}

	const handleCreatePrivateRoom = () => {
		// TODO: Implement create private room functionality
		console.log("Creating private room...")
	}

	const handleJoinRoom = () => {
		setIsJoinModalOpen(true)
	}

	const handleJoinRoomSubmit = async (roomCode: string) => {
		try {
			setIsJoiningRoom(true)
			logger.info("Joining room with code:", roomCode)

			const room = await roomService.getRoomById(roomCode)
			logger.info("Room found successfully:", room)

			// Close the modal
			setIsJoinModalOpen(false)

			// Navigate to the room page with room data
			navigate(`/room/${room.room_id}`, {
				state: { room: room },
				replace: false
			})
		} catch (error) {
			logger.error("Failed to join room:", error)
			// TODO: Show error toast/notification
			alert(`Failed to join room: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			setIsJoiningRoom(false)
		}
	}

	const handleCloseJoinModal = () => {
		setIsJoinModalOpen(false)
	}

	const handleAccountClick = () => {
		// TODO: Navigate to account/profile page
		console.log("Navigate to account page")
	}

	const handleLogout = () => {
		logout()
		goToHome()
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Header */}
			<header className="border-b border-border">
				<div className="container mx-auto px-8 py-4">
					<div className="flex items-center justify-between">
						{/* Logo and Brand */}
						<div className="flex items-center gap-3 cursor-pointer" onClick={goToHome}>
							<div className="w-6 h-6">
								<img src="/src/assets/logo.svg" alt="CodeHall Logo" className="w-full h-full" />
							</div>
							<span className="text-xl font-bold">CodeHall</span>
						</div>

						{/* User Profile Section */}
						<div className="flex items-center gap-4">
							{/* Help Icon */}
							<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>

							{/* User Avatar with Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
										<span className="text-sm font-medium text-white">
											{user?.username?.charAt(0)?.toUpperCase() || 'U'}
										</span>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<div className="flex items-center justify-start gap-2 p-2">
										<div className="flex flex-col space-y-1 leading-none">
											<p className="font-medium">{user?.username}</p>
											<p className="text-xs text-muted-foreground">
												{user?.email}
											</p>
										</div>
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleAccountClick} className="cursor-pointer">
										<User className="mr-2 h-4 w-4" />
										<span>Account</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
										<LogOut className="mr-2 h-4 w-4" />
										<span>Logout</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-8 py-12">
				<div className="max-w-4xl mx-auto space-y-12">
					{/* Welcome Section */}
					<div className="text-center space-y-2">
						<h1 className="text-4xl font-bold">Welcome back, {user?.username || 'User'}!</h1>
					</div>

					{/* Create Room Section */}
					<div className="space-y-8">
						<h2 className="text-2xl font-semibold">Create a New Room</h2>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Public Room Card */}
							<Card className="bg-card border-border overflow-hidden group hover:shadow-lg transition-shadow">
								<CardContent className="p-8">
									<div className="flex flex-col lg:flex-row items-center gap-6">
										<div className="flex-1 space-y-4">
											<div className="space-y-2">
												<h3 className="text-xl font-semibold">Public Room</h3>
												<p className="text-muted-foreground text-sm leading-relaxed">
													Anyone can join and collaborate.
												</p>
											</div>
											<Button
												onClick={handleCreatePublicRoom}
												className="w-full lg:w-auto bg-primary hover:bg-primary/90"
											>
												<Users className="w-4 h-4 mr-2" />
												Create
											</Button>
										</div>

										{/* Illustration */}
										<div className="w-48 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
											<div className="relative">
												{/* Computer illustration */}
												<div className="w-20 h-12 bg-slate-300 rounded-lg relative">
													<div className="absolute inset-2 bg-white rounded-sm"></div>
													<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-1 h-2 bg-slate-400"></div>
													<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full w-8 h-1 bg-slate-400 rounded-full"></div>
												</div>
												{/* Decorative elements */}
												<div className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full"></div>
												<div className="absolute -bottom-1 -left-3 w-4 h-6 bg-orange-400 rounded-full"></div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Private Room Card */}
							<Card className="bg-card border-border overflow-hidden group hover:shadow-lg transition-shadow">
								<CardContent className="p-8">
									<div className="flex flex-col lg:flex-row items-center gap-6">
										<div className="flex-1 space-y-4">
											<div className="space-y-2">
												<h3 className="text-xl font-semibold">Private Room</h3>
												<p className="text-muted-foreground text-sm leading-relaxed">
													Invite-only collaboration for exclusive projects.
												</p>
											</div>
											<Button
												onClick={handleCreatePrivateRoom}
												variant="outline"
												className="w-full lg:w-auto"
											>
												<Lock className="w-4 h-4 mr-2" />
												Create
											</Button>
										</div>

										{/* Illustration */}
										<div className="w-48 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
											<div className="relative">
												{/* Monitor illustration */}
												<div className="w-24 h-16 bg-slate-300 rounded-lg relative">
													<div className="absolute inset-2 bg-white rounded-sm flex items-center justify-center">
														{/* Screen content - simple mountain illustration */}
														<div className="flex items-end space-x-1">
															<div className="w-3 h-4 bg-green-400 rounded-t-full"></div>
															<div className="w-3 h-6 bg-green-500 rounded-t-full"></div>
															<div className="w-3 h-3 bg-green-300 rounded-t-full"></div>
														</div>
														<div className="absolute top-1 left-1 w-1 h-1 bg-yellow-400 rounded-full"></div>
													</div>
													<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-3 bg-slate-400"></div>
													<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-full w-12 h-2 bg-slate-400 rounded-full"></div>
												</div>
												{/* Lock icon */}
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
													<Lock className="w-2 h-2 text-white" />
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Join Room Section */}
					<div className="flex justify-center">
						<Button
							onClick={handleJoinRoom}
							size="lg"
							className="w-full max-w-md h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium"
						>
							<Plus className="w-5 h-5 mr-2" />
							Join Room
						</Button>
					</div>
				</div>
			</main>

			{/* Join Room Modal */}
			<JoinRoomModal
				isOpen={isJoinModalOpen}
				onClose={handleCloseJoinModal}
				onJoin={handleJoinRoomSubmit}
				isLoading={isJoiningRoom}
			/>

			{/* Create Room Modal */}
			<CreateRoomModal
				isOpen={isCreateRoomModalOpen}
				onClose={handleCloseCreateRoomModal}
				onCreateRoom={handleCreateRoomSubmit}
				isLoading={isCreatingRoom}
			/>
		</div>
	)
}

export default Dashboard 