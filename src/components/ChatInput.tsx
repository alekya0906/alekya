import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex items-end gap-3">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent border border-input focus:border-foreground/40 
          rounded px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground 
          resize-none outline-none transition-colors caret-primary"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded 
          bg-primary text-primary-foreground disabled:opacity-20 
          transition-opacity hover:opacity-90"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ChatInput;
