import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { streamChat, type Msg } from "@/lib/stream-chat";

const Index = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (input: string) => {
    const userMsg: Msg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsStreaming(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: updatedMessages,
        onDelta: upsertAssistant,
        onDone: () => setIsStreaming(false),
      });
    } catch (e) {
      setIsStreaming(false);
      toast.error(e instanceof Error ? e.message : "Failed to get response");
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[720px] flex-1 flex flex-col px-4 py-8">
        {/* Chat history */}
        <div
          className={`flex-1 flex flex-col justify-end gap-6 ${
            isStreaming ? "history-dimmed" : "history-normal"
          }`}
          style={{ minHeight: isEmpty ? undefined : 0 }}
        >
          {isEmpty && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm font-mono">
                Ask anything.
              </p>
            </div>
          )}

          {messages.slice(0, isStreaming ? -1 : undefined).map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
        </div>

        {/* Active streaming message — outside dimmed container */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
          <div className="mt-6">
            <ChatMessage
              role="assistant"
              content={messages[messages.length - 1].content}
              isStreaming
            />
          </div>
        )}

        {/* Input */}
        <div className="mt-8 pb-4">
          <ChatInput onSend={send} disabled={isStreaming} />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Index;
