import { useRef, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  message as messageAlert,
  Col,
  Row,
  Form,
  Input,
  Button,
  FormInstance,
  Avatar,
} from "antd";
import useAuth from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";
import Home from "./Home";

interface Message {
  sender_id: string;
  message: string;
  created_at: string; // Add this field to your Message interface
}

type MessageForm = {
  message: string;
};

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
  const formRef = useRef<FormInstance>(null);
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
        if (data.length > 0) {setLastSeen(data[data.length - 1].created_at)}
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

  const onNewMessage = async ({ message }: MessageForm) => {
    if (user?.id && recipientId) {
      if (message.trim()) {
        socketRef.current?.emit("sendMessage", { senderId: user.id, recipientId, message });
        formRef.current?.resetFields();
      } else {
        messageAlert.error("Enter a message", 2.5);
      }
    } else {
      messageAlert.error("Please Login / Sign Up", 2.5);
    }
  };

  const scrollToBottom = () => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageTime = (utcTimeStr: string) => {
    const utcDate = new Date(utcTimeStr);
    const options:any = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    return utcDate.toLocaleTimeString('en-US', options);
  };

  return (
    <>
      {user ? (
        <Row justify="center" style={{ backgroundColor: "#FAF3EA" }}>
          <Col
            xs={24}
            style={{
              height: "80vh",
              overflow: "auto",
              paddingTop: "64px",
            }}
            ref={listRef}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FAF3EA",
                padding: "10px 20px 10px 15px",
                borderBottom: "0px solid #ddd",
                position: "fixed",
                top: "0",
                width: "100%",
                zIndex: 1000,
                margin: "64px 10px 0px 18px",
              }}
            >
              <Avatar src="../../public/avatar3.png" size={40} />
              <div style={{ marginLeft: "0px" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  {recipientName || "Chatbot"}
                </p>
                {recipientName && lastSeen ? (
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    Last seen at {messageTime(lastSeen)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col mt-10 p-8">
              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex ${
                    item.sender_id === user?.id ? "justify-end" : "justify-start"
                  } my-2`}
                >
                  <div
                    className={`max-w-[60%] p-2 rounded-2xl shadow-md flex flex-row ${
                      item.sender_id === user?.id ? "bg-[#dcf8c6]" : "bg-white"
                    }`}
                  >
                    <p className="m-0 text-black">{item.message}</p>
                    <p className="m-0 text-gray-500 text-[10px] mt-1.5 p-1">
                      {messageTime(item.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {recipientName ? (
            <div className="p-4 bg-[#FAF3EA] fixed bottom-0 w-[70%] flex items-center">
              <Form
                ref={formRef}
                layout="vertical"
                initialValues={{ message: "" }}
                className="flex w-full"
                onFinish={onNewMessage}
              >
                <Form.Item name="message" className="flex-grow mb-0 w-[70%]">
                  <Input placeholder="Enter your message..." />
                </Form.Item>
                <Form.Item className="mb-0 ml-4 w-[20%]">
                  <Button type="primary" htmlType="submit" className="ml-2 border-none">
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </div>
          ) : null}
        </Row>
      ) : (
        <Home />
      )}
    </>
  );
};

export default MessageList;
