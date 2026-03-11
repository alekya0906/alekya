import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ role, content, isStreaming }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={`w-full ${isUser ? "" : "pl-6"} ${
        isUser ? "opacity-[0.6]" : "opacity-100"
      }`}
    >
      <div
        className={`text-sm leading-relaxed font-mono text-foreground ${
          !isUser && isStreaming ? "response-enter" : ""
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none 
            prose-p:text-foreground prose-p:leading-relaxed
            prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:rounded
            prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded
            prose-headings:text-foreground prose-headings:font-mono
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-li:text-foreground
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
        {isStreaming && role === "assistant" && (
          <span className="inline-block w-[2px] h-4 bg-primary cursor-blink ml-0.5 align-text-bottom" />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
