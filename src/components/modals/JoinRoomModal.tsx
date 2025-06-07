import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Hash } from "lucide-react"

interface JoinRoomModalProps {
	isOpen: boolean
	onClose: () => void
	onJoin: (roomCode: string) => void
	isLoading?: boolean
}

const JoinRoomModal = ({ isOpen, onClose, onJoin, isLoading = false }: JoinRoomModalProps) => {
	const [roomCode, setRoomCode] = useState("")
	const [error, setError] = useState("")

	const validateRoomCode = (code: string): boolean => {
		// Room code should be 6-10 characters (matching the API format like GMB018)
		const regex = /^[A-Z0-9]{3,10}$/
		return regex.test(code)
	}

	const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setRoomCode(value)

		// Clear error when user starts typing
		if (error) {
			setError("")
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!roomCode.trim()) {
			setError("Please enter a room code")
			return
		}

		if (!validateRoomCode(roomCode.toUpperCase())) {
			setError("Room code must be 3-10 characters (letters and numbers)")
			return
		}

		onJoin(roomCode.trim().toUpperCase())
	}

	const handleClose = () => {
		if (isLoading) return // Prevent closing while loading

		setRoomCode("")
		setError("")
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Hash className="w-5 h-5 text-primary" />
						Join Room
					</DialogTitle>
					<DialogDescription>
						Enter a room code to join an existing collaboration session.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Room Code Input */}
					<div className="space-y-2">
						<Label htmlFor="roomCode" className="text-sm font-medium">
							Room Code
						</Label>
						<Input
							id="roomCode"
							type="text"
							placeholder="Enter room code (e.g., GMB018)"
							value={roomCode}
							onChange={handleRoomCodeChange}
							className={`text-center text-lg font-mono tracking-wider uppercase ${error ? 'border-destructive focus:border-destructive' : ''
								}`}
							maxLength={10}
							autoComplete="off"
							disabled={isLoading}
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>3-10 characters (letters and numbers)</span>
							<span>{roomCode.length}/10</span>
						</div>
						{error && (
							<p className="text-sm text-destructive mt-1">{error}</p>
						)}
					</div>

					<DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							className="w-full sm:w-auto"
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
							disabled={!roomCode.trim() || isLoading}
						>
							{isLoading ? "Joining..." : "Join Room"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default JoinRoomModal 