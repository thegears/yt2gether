import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { RealtimeChannel } from "@supabase/supabase-js/dist/index.cjs";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { MessageAuthor } from "@/app/room/[id]/page";
import {
  Gamepad2,
  Cpu,
  Ghost,
  Terminal,
  Code2,
  Zap,
  Skull,
  Cat,
  Headphones,
  MonitorPlay,
  User,
  User2,
} from "lucide-react";

export default function Chat({
  messages,
  setMessages,
  channel,
  author,
}: {
  messages: { content: string; author: MessageAuthor }[];
  setMessages: Dispatch<
    SetStateAction<{ author: MessageAuthor; content: string }[]>
  >;
  channel: RealtimeChannel;
  author: MessageAuthor;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function handleChatInput(e: React.SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const content = formData.get("content") as string;

    if (!content) return;

    const message = {
      author,
      content,
    };

    channel.send({
      type: "broadcast",
      event: "chat",
      payload: message,
    });

    setMessages((prev) => [...prev, message]);

    e.target.reset();
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="grow overflow-y-auto">
        {messages.map((message, i) => (
          <Message key={i} content={message.content} author={message.author} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div>
        <form onSubmit={handleChatInput}>
          <Input name="content" placeholder="Send a message..." />
        </form>
      </div>
    </div>
  );
}

function Message({
  content,
  author,
}: {
  content: string;
  author: MessageAuthor;
}) {
  return (
    <div className="bg-accent p-2 rounded-2xl flex mb-2">
      <Icon color={author.color} iconName={author.icon} />
      <div className="flex-col">
        <div className="font-bold text-sm">{author.name}</div>
        <div className="break-all text-xs">{content}</div>
      </div>
    </div>
  );
}

const ICON_MAP = {
  Gamepad2,
  Cpu,
  Ghost,
  Terminal,
  Code2,
  Zap,
  Skull,
  Cat,
  Headphones,
  MonitorPlay,
  User,
  User2,
};

function Icon({ color, iconName }: { color: string; iconName: string }) {
  const UserIconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP] || User;
  return (
    <Avatar className="h-auto mr-1 border">
      <AvatarFallback
        style={{ backgroundColor: color }}
        className="text-xs text-white font-medium"
      >
        <UserIconComponent />
      </AvatarFallback>
    </Avatar>
  );
}
