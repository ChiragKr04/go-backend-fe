import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CreateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (roomData: { room_name: string; room_description: string }) => void;
    isLoading?: boolean;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
    isOpen,
    onClose,
    onCreateRoom,
    isLoading = false,
}) => {
    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [errors, setErrors] = useState<{ roomName?: string; roomDescription?: string }>({});

    const validateForm = () => {
        const newErrors: { roomName?: string; roomDescription?: string } = {};

        if (!roomName.trim()) {
            newErrors.roomName = "Room name is required";
        } else if (roomName.length > 255) {
            newErrors.roomName = "Room name must be less than 255 characters";
        }

        if (!roomDescription.trim()) {
            newErrors.roomDescription = "Room description is required";
        } else if (roomDescription.length > 1000) {
            newErrors.roomDescription = "Room description must be less than 1000 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onCreateRoom({
            room_name: roomName.trim(),
            room_description: roomDescription.trim(),
        });
    };

    const handleClose = () => {
        setRoomName("");
        setRoomDescription("");
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Public Room</DialogTitle>
                    <DialogDescription>
                        Create a new public room for collaborative coding. Anyone can join and participate.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Room Name */}
                    <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name *</Label>
                        <Input
                            id="roomName"
                            type="text"
                            placeholder="Enter room name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            maxLength={255}
                            disabled={isLoading}
                            className={errors.roomName ? "border-red-500" : ""}
                        />
                        <div className="flex justify-between items-center">
                            {errors.roomName && (
                                <p className="text-sm text-red-600">{errors.roomName}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {roomName.length}/255 characters
                            </p>
                        </div>
                    </div>

                    {/* Room Description */}
                    <div className="space-y-2">
                        <Label htmlFor="roomDescription">Room Description *</Label>
                        <Textarea
                            id="roomDescription"
                            placeholder="Describe what this room is for..."
                            value={roomDescription}
                            onChange={(e) => setRoomDescription(e.target.value)}
                            maxLength={1000}
                            disabled={isLoading}
                            className={`min-h-24 ${errors.roomDescription ? "border-red-500" : ""}`}
                        />
                        <div className="flex justify-between items-center">
                            {errors.roomDescription && (
                                <p className="text-sm text-red-600">{errors.roomDescription}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {roomDescription.length}/1000 characters
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !roomName.trim() || !roomDescription.trim()}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLoading ? "Creating..." : "Create Room"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRoomModal; 