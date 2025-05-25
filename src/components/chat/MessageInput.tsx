import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  maxLength = 500,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() || disabled || isSending) return;

    const messageToSend = message.trim();
    setIsSending(true);

    try {
      await onSendMessage(messageToSend);
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  const isDisabled = disabled || isSending;
  const canSend = message.trim().length > 0 && !isDisabled;

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isDisabled}
          className="pr-12"
          autoComplete="off"
        />
        {maxLength && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {message.length}/{maxLength}
          </div>
        )}
      </div>

      <Button
        onClick={handleSend}
        disabled={!canSend}
        size="sm"
        className="px-3"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}; 