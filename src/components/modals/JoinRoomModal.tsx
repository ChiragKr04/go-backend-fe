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
import { Users, Lock, Hash } from "lucide-react"

interface JoinRoomModalProps {
    isOpen: boolean
    onClose: () => void
    onJoin: (roomCode: string, roomType: 'public' | 'private') => void
}

const JoinRoomModal = ({ isOpen, onClose, onJoin }: JoinRoomModalProps) => {
    const [roomCode, setRoomCode] = useState("")
    const [roomType, setRoomType] = useState<'public' | 'private'>('public')
    const [error, setError] = useState("")

    const validateRoomCode = (code: string): boolean => {
        // Room code should be 6-10 uppercase alpha characters
        const regex = /^[A-Z]{6,10}$/
        return regex.test(code)
    }

    const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
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

        if (!validateRoomCode(roomCode)) {
            setError("Room code must be 6-10 uppercase letters (A-Z)")
            return
        }

        onJoin(roomCode, roomType)
        handleClose()
    }

    const handleClose = () => {
        setRoomCode("")
        setRoomType('public')
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
                    {/* Room Type Selection */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Room Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Public Room Option */}
                            <div
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${roomType === 'public'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                onClick={() => setRoomType('public')}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${roomType === 'public' ? 'border-primary' : 'border-muted-foreground'
                                        }`}>
                                        {roomType === 'public' && (
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-sm">Public</span>
                                    </div>
                                </div>
                            </div>

                            {/* Private Room Option */}
                            <div
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${roomType === 'private'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                onClick={() => setRoomType('private')}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${roomType === 'private' ? 'border-primary' : 'border-muted-foreground'
                                        }`}>
                                        {roomType === 'private' && (
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-sm">Private</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Room Code Input */}
                    <div className="space-y-2">
                        <Label htmlFor="roomCode" className="text-sm font-medium">
                            Room Code
                        </Label>
                        <Input
                            id="roomCode"
                            type="text"
                            placeholder="Enter room code (e.g., ABCDEF)"
                            value={roomCode}
                            onChange={handleRoomCodeChange}
                            className={`text-center text-lg font-mono tracking-wider ${error ? 'border-destructive focus:border-destructive' : ''
                                }`}
                            maxLength={10}
                            autoComplete="off"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>6-10 uppercase letters only</span>
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
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                            disabled={!roomCode.trim()}
                        >
                            Join Room
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default JoinRoomModal 