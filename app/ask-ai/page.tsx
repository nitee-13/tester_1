'use client';
import * as React from "react";
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import styles from "./askAi.module.css";

type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

export default function AskAI() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedModel, setSelectedModel] = React.useState<string>("model1");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        sender: "user",
        text: inputValue.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          sender: "bot",
          text: `Response using ${selectedModel}: ${inputValue}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className="h-full flex flex-col">
        {/* Messages Container */}
        <div className={`${styles.messagesContainer} flex-1 overflow-y-auto`}>
          {messages.map((message, index) => (
            <div key={index} className={styles.messageWrapper}>
              <div className={message.sender === "user" ? styles.messageUser : styles.messageBot}>
                <div className={styles.messageContent}>
                  <div className={styles.textAndTimestamp}>
                    <p className={styles.messageText}>{message.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className={styles.emptyMessages}>
              <p className={styles.emptyText}>Start a conversation with AI</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className={`${styles.inputContainer} bg-background`}>
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model1">Model 1</SelectItem>
                <SelectItem value="model2">Model 2</SelectItem>
                <SelectItem value="model3">Model 3</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className={styles.messageInput}
            />
            
            <Button 
              onClick={handleSend}
              className={styles.sendButton}
              variant="default"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
