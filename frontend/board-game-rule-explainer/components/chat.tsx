'use client';

import { Card } from "@/components/ui/card"
import { type CoreMessage } from 'ai';
import { useState, useEffect } from 'react';
import { continueTextConversation } from '@/app/chat/actions';
import { readStreamableValue } from 'ai/rsc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from '@/components/ui/icons';
import  Link from "next/link";
import AboutCard from "@/components/cards/aboutcard";
export const maxDuration = 30;
import io from 'Socket.IO-client';

let socket


export default function Chat(props: {title: string, description: string}) {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState<string>('');  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];
    setMessages(newMessages);
    setInput('');
    const result = await continueTextConversation(newMessages);
    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: content as string, 
        },
      ]);
    }
  }
  useEffect(() => socketInitializer(), []);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })
  }

  return null
  
  return (    
    <div className="group w-full overflow-auto ">
     
      <AboutCard title={props.title} description={props.description} />  
      <div className="max-w-xl mx-auto mt-10 mb-24">
        {messages.map((message, index) => (
          <div key={index} className="whitespace-pre-wrap flex mb-5">
            <div className={`${message.role === 'user' ? 'bg-slate-200 ml-auto' : 'bg-slate-400'} p-2 rounded-lg`}>
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
                  onChange={event => {
                    setInput(event.target.value);
                  }}
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none"
                  placeholder='Ask me anything...'
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
