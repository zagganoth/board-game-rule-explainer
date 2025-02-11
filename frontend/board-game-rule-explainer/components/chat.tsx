"use client";

import { Card } from "@/components/ui/card";
import { type CoreMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { continueTextConversation } from "@/app/chat/actions";
import { readStreamableValue } from "ai/rsc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconArrowUp } from "@/components/ui/icons";
import Link from "next/link";
import AboutCard from "@/components/cards/aboutcard";
export const maxDuration = 30;
import io from "Socket.IO-client";

let socket: WebSocket;

export default function Chat(props: { title: string; description: string }) {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [endMessage, setEndMessage] = useState<boolean>(false);
  const messagesRef = useRef<CoreMessage[]>([]);
  const currentResponseRef = useRef<string>("");
  const endMessageRef = useRef<boolean>(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setMessages(newMessages);
    socket.send(input);
    setInput("");
  };
  const socketInitializer = () => {
    //await fetch('http://localhost:8000/message')
    socket = new WebSocket(
      `ws://192.168.2.35:8000/message?filename=${encodeURIComponent(
        props.title.replaceAll(":", " ")
      )}.pdf`
    );
    if (socket != null) {
      socket.onopen = (event) => {
        console.log("connected");
      };

      socket.onmessage = (event) => {
        console.log(messagesRef);
        console.log(currentResponseRef);
        setCurrentResponse((prevResponse) => prevResponse + event.data);
        const lastAssistantIndex = messagesRef.current
          .map((msg) => msg.role)
          .lastIndexOf("assistant");
        let messagesToKeep: CoreMessage[];
        if (lastAssistantIndex >= 0 && !endMessageRef.current) {
          messagesToKeep = [
            ...messagesRef.current.slice(0, lastAssistantIndex),
            ...messagesRef.current.slice(lastAssistantIndex + 1),
          ];
        } else {
          if (endMessageRef.current) {
            setEndMessage(false);
          }
          messagesToKeep = messagesRef.current;
        }
        setMessages([
          ...messagesToKeep,
          { content: currentResponseRef.current, role: "assistant" },
        ]);
        if (event.data == "[END]") {
          setEndMessage(true);
          setCurrentResponse("");
        }
      };
    }
  };

  useEffect(() => {
    socketInitializer();
  }, []);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    currentResponseRef.current = currentResponse;
  }, [currentResponse]);
  useEffect(() => {
    endMessageRef.current = endMessage;
  }, [endMessage]);
  return (
    <div className="group w-full overflow-auto ">
      <AboutCard title={props.title} description={props.description} />
      <div className="max-w-xl mx-auto mt-10 mb-24">
        {messages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap flex mb-5">
            <div
              className={`${
                message.role === "user"
                  ? "bg-slate-200 ml-auto"
                  : "bg-slate-400"
              } p-2 rounded-lg`}
            >
              {message.content as string}
            </div>
          </div>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-10 w-full ">
        <div className="w-full max-w-xl mx-auto">
          <Card className="p-2">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <Input
                  type="text"
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                  }}
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none"
                  placeholder="Ask me anything..."
                />
                <Button disabled={!input.trim()}>
                  <IconArrowUp />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
