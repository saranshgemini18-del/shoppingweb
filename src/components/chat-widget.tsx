'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { chat } from '@/ai/flows/chat-flow';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const quickReplies = [
  'What are your shipping policies?',
  'How can I track my order?',
  'What is your return policy?',
];


export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content:
            'Namaste! I am an AI assistant. How can I help you explore Bharat Bazaar today?',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsPending(true);

    try {
      const response = await chat(newMessages);
      const botMessage: Message = {
        role: 'model',
        content: response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch(e) {
        console.error(e);
        const botMessage: Message = {
            role: 'model',
            content: 'Sorry, I am having trouble connecting to the server. Please try again later.',
        };
        setMessages((prev) => [...prev, botMessage]);
    } finally {
        setIsPending(false);
    }

  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
    setInput('');
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        aria-label="Open Chat"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl">
              Support Chat
            </SheetTitle>
          </SheetHeader>
          <ScrollArea
            className="flex-grow my-4 -mx-6 px-6"
            ref={scrollAreaRef}
          >
            <div className="space-y-4 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs rounded-lg p-3 text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-end gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs rounded-lg p-3 bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
           <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2 px-1">Quick Replies</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => handleQuickReply(reply)} disabled={isPending}>
                  {reply}
                </Button>
              ))}
            </div>
          </div>
          <SheetFooter className="mt-4">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isPending}
              />
              <Button type="submit" disabled={isPending || !input.trim()}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
