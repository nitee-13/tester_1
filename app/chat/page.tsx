'use client';
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Files, SendHorizontal, Trash2 } from "lucide-react";
import styles from "./chat.module.css";
import { useSources } from "@/context/SourcesContext";
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from "react-simple-typewriter";

type Message = {
  sender: "user" | "bot";
  text: string;
  files?: File[];
};

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { addSources } = useSources();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() || selectedFiles.length > 0) {
      const newMessage: Message = {
        sender: "user",
        text: inputValue.trim(),
        files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
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

      setTimeout(() => {
        const botMessage: Message = { 
          sender: "bot", 
          text: "This is a bot response." 
        };
        console.log("[Chat] Adding botMessage", botMessage)
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
                message.sender === "user" ? styles.messageUser : styles.messageBot
              }
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.text}</p>
                {message.files && message.files.length > 0 && (
                  <div className={styles.fileList}>
                    {message.files.map((file, fileIndex) => (
                      <div key={fileIndex} className={styles.fileAttachment}>
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                )}
                <span className={styles.messageTime}>
                  {new Date().toLocaleTimeString()}
                </span>
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