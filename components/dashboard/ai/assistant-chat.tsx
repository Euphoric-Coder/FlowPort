'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronRight, MessageSquare, Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getAssistantResponse, insights } from '@/data/mock';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  bullets?: string[];
}

const SUGGESTIONS = [
  'Which warehouses are approaching capacity?',
  'Show delayed shipments.',
  'Identify inventory risks.',
  "Summarize today's operations.",
];

let idCounter = 1;

export function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Welcome to FlowPort Intelligence. Ask me about your simulated network — warehouses, shipments, inventory, fleet, or routes.',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setInput('');
    setMessages((m) => [...m, { id: idCounter++, role: 'user', text: q }]);
    setThinking(true);
    setTimeout(() => {
      const r = getAssistantResponse(q);
      setMessages((m) => [...m, { id: idCounter++, role: 'assistant', text: r.response, bullets: r.bullets }]);
      setThinking(false);
    }, 900);
  };

  return (
    <Card className="flex h-[520px] flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4 text-primary" />
          AI Operations Assistant
        </CardTitle>
        <CardDescription>
          Grounded in the mock dataset with predefined responses — no external AI service is called.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-lg bg-elevated p-3">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-2.5', m.role === 'user' && 'flex-row-reverse')}
            >
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                  m.role === 'assistant' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                )}
              >
                {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div
                className={cn(
                  'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.role === 'assistant'
                    ? 'rounded-tl-sm border border-border/60 bg-card'
                    : 'rounded-tr-sm bg-primary text-primary-foreground'
                )}
              >
                <p>{m.text}</p>
                {m.bullets && (
                  <ul className="mt-2 space-y-1.5">
                    {m.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <div className="flex gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-border/60 bg-card px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={thinking}
              className="rounded-full border border-border/70 bg-elevated px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about your network…"
            rows={1}
            className="min-h-[40px] resize-none"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || thinking} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function InsightHighlights() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {insights.slice(0, 4).map((i, idx) => (
        <motion.div
          key={i.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="rounded-xl border border-border/70 bg-card p-4"
        >
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-primary">{i.category}</span>
            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {i.confidence}% confidence
            </span>
          </div>
          <p className="mt-2 text-sm font-medium leading-snug">{i.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.explanation}</p>
        </motion.div>
      ))}
    </div>
  );
}
