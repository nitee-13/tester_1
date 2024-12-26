'use client';
import * as React from "react";
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Files, SendHorizontal, Trash2 } from "lucide-react";
import styles from "./chat.module.css";
import { useSources } from "@/context/SourcesContext";
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from "react-simple-typewriter";

const THINKING_PHRASES = [
  "Analyzing Pdf",
  "Extracting Sentences",
  "Creating Chunks",
  "Implementing Knowledge Graph",
  "Generating Graph of Thoughts",
  "Performing Contextual Analysis",
  "Fact Checking with Neural Engine",
  "Finalizing Ideas"
];

type Message = {
  sender: "user" | "bot";
  text: string;
  files?: File[];
  isThinking?: boolean; // Done to generate thinking phrases
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const { addSources } = useSources();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      console.log("[Chat] Starting message send process");
      const newMessage: Message = {
        sender: "user",
        text: inputValue.trim(),
        files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");
      
      if (selectedFiles.length > 0) {
        const newSources = selectedFiles.map(file => ({
          id: uuidv4(),
          name: file.name,
          uploadTime: new Date(),
        }));
        console.log("newSources", newSources)
        addSources(newSources);
      }

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Add initial delay before showing first thinking message
      const initialDelay = 1000; // 1 second delay
      const phraseDisplayTime = 3000; // 3 seconds per phrase

      const initialTimeoutId = setTimeout(() => {
        // Add initial thinking message
        const thinkingMessage: Message = {
          sender: "bot",
          text: THINKING_PHRASES[0],
          isThinking: true,
          timestamp: new Date(),
        }
        console.log("[Chat] Adding initial thinking message:", THINKING_PHRASES[0]);
        setMessages((prev) => [...prev, thinkingMessage]);

        // Start the thinking phrases after the initial message
        THINKING_PHRASES.forEach((phrase, index) => {
          if (index === 0) return; // Skip first phrase as it's already shown
          
          const timeoutId = setTimeout(() => {
            console.log(`[Chat] Updating to thinking phrase ${index + 1}:`, phrase);
            setMessages((prev) => {
              const updatedMessages = [...prev];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              
              if (lastMessage && lastMessage.isThinking) {
                lastMessage.text = phrase;
                lastMessage.timestamp = new Date(); // Update timestamp if needed
                console.log(`[Chat] Updated thinking message to: ${phrase}`);
              }
              return updatedMessages;
            });
          }, phraseDisplayTime * index);

          timeoutRef.current.push(timeoutId);
        });

        // Separate timeout for the final bot response
        const finalTimeoutId = setTimeout(() => {
          console.log("[Chat] Adding final bot response");
          setMessages((prev) => {
            const messagesWithoutThinking = prev.filter(msg => !msg.isThinking);
            return [
              ...messagesWithoutThinking,
              {
                sender: "bot",
                text: "This is a bot response.",
                isThinking: false,
                timestamp: new Date(),
              }
            ];
          });
        }, phraseDisplayTime * THINKING_PHRASES.length + 1000); // Add slight delay after last thinking phrase

        timeoutRef.current.push(finalTimeoutId);
      }, initialDelay);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    console.log("[Chat] handleFileClick")
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      console.log("[Chat] handleFileChange", filesArray)
      setSelectedFiles(filesArray);
    }
  };

  const handleClearFiles = () => {
    console.log("[Chat] Clearing Selected Files")
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer} id="messagesContainer">
        {messages.map((message, index) => (
          <div key={index} className={styles.messageWrapper}>
            <div
              className={
                message.sender === "user" 
                ? styles.messageUser 
                : message.isThinking 
                ? styles.messageThinking 
                : styles.messageBot
              }
            >
              <div className={styles.messageContent}>
                <div className={styles.textAndTimestamp}>
                  <p className={`${styles.messageText} ${message.isThinking ? styles.thinkingText : ''}`}>
                    {message.sender === "bot" ? (
                      message.isThinking ? (
                        <Typewriter
                          key={message.text}
                          words={[`${message.text}...`]}
                          loop={0}
                          cursor={true}
                          cursorStyle='|'
                          typeSpeed={50}
                          deleteSpeed={200}
                          delaySpeed={100}
                        />
                      ) : (
                        <Typewriter
                          words={[message.text]}
                          loop={1}
                          cursor={false}
                          typeSpeed={30}
                          deleteSpeed={50}
                          delaySpeed={500}
                        />
                      )
                    ) : (
                      message.text
                    )}
                  </p>
                </div>
                {message.files && (
                  <div className={styles.fileList}>
                    {message.files.map((file, fileIndex) => (
                      <div key={fileIndex} className={styles.fileAttachment}>
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className={styles.emptyMessages}>
            <p className={styles.emptyText}>
              <Typewriter
                words={['Welcome to Legal Document Analyzer']}
                loop={1}
                cursor
                cursorStyle='|'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <Button 
          variant="ghost"
          size="icon"
          className={styles.attachButton}
          onClick={handleFileClick}
        >
          <Files className="h-4 w-4" />
        </Button>

        {selectedFiles.length > 0 && (
          <Button 
            variant="ghost"
            size="icon"
            className={styles.deleteButton}
            onClick={handleClearFiles}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
        
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={selectedFiles.length > 0 
            ? `${selectedFiles.length} file(s) selected. Type a message...` 
            : "Type your message..."}
          className={styles.messageInput}
        />
        
        <Button 
          onClick={handleSend}
          className={styles.sendButton}
        >
          <SendHorizontal className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
} 