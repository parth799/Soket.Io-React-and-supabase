import { useRef, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { io, Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
import Home from "./Home";

interface Message {
  sender_id: string;
  message: string;
  created_at: string;
}

const MessageList = ({
  user,
  recipientId,
  recipientName,
}: {
  user: User | null;
  recipientId: string;
  recipientName: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { getLoginUser } = useAuth();
  const [loginUserId, setLoginUserId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const loginUserData = await getLoginUser();
      setLoginUserId(loginUserData.id);
    })();
  }, [getLoginUser]);

  useEffect(() => {
    if (user?.id && recipientId) {
      socketRef.current = io("http://localhost:3000");

      const socket = socketRef.current;

      socket.emit("joinRoom", { userId: user.id, recipientId });
      socket.emit("getMessages", { senderId: user.id, recipientId });

      socket.on("messages", (data: Message[]) => {
        setMessages(data);
        if (data.length > 0) {
          setLastSeen(data[data.length - 1].created_at);
        }
        scrollToBottom();
      });

      socket.on("receiveMessage", (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLastSeen(newMessage.created_at);
        scrollToBottom();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?.id, recipientId, recipientName]);

  const onNewMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString().trim();

    if (user?.id && recipientId && message) {
      socketRef.current?.emit("sendMessage", {
        senderId: user.id,
        recipientId,
        message,
      });
      formRef.current?.reset();
    } else {
      alert("Enter a message or Please Login / Sign Up");
    }
  };

  const scrollToBottom = () => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageTime = (utcTimeStr: string) => {
    const utcDate = new Date(utcTimeStr);
    const options: any = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return utcDate.toLocaleTimeString("en-US", options);
  };

  return (
    <>
      {user ? (
        <div className="flex flex-col h-[630px] px-4 bg-[#FAF3EA]">
          {/* Navbar */}
          <div className="flex items-center bg-[#FAF3EA] p-4 border-b border-gray-300">
            <img
              src="../../public/avatar3.png"
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-4">
              <p className="font-bold">{recipientName || "Chatbot"}</p>
              {recipientName && lastSeen ? (
                <p className="text-sm text-gray-500">
                  Last seen at {messageTime(lastSeen)}
                </p>
              ) : null}
            </div>
          </div>

          <div
            className="flex-1 overflow-auto pt-2"
            ref={listRef}
          >
            <div className="flex flex-col px-4 pb-4">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.sender_id === user?.id
                      ? "justify-end"
                      : "justify-start"
                  } my-2`}
                >
                  <div
                    className={`max-w-[60%] p-2 rounded-2xl shadow-md flex ${
                      item.sender_id === user?.id
                        ? "bg-[#dcf8c6]"
                        : "bg-white"
                    }`}
                  >
                    <p className="m-0 text-black break-words mr-2">
                      {item.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-auto ml-2">
                      {messageTime(item.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          {recipientName ? (
            <form
              ref={formRef}
              onSubmit={onNewMessage}
              className="p-4 bg-[#FAF3EA] flex items-center"
            >
              <input
                name="message"
                placeholder="Enter your message..."
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2 mr-4"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </form>
          ) : null}
        </div>
      ) : (
        <Home />
      )}
    </>
  );
};

export default MessageList;
