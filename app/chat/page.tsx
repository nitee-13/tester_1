'use client';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Files, SendHorizontal, Trash2 } from "lucide-react";
import styles from "./chat.module.css";
import { useSources } from "@/context/SourcesContext";
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from "react-simple-typewriter";
import PdfViewer from "@/components/PdfViewer";
import { useRouter } from "next/navigation";
import { analyzeContract, getAnalysisStatus, getAnalysisResult } from "@/app/services/api";
import RedFlagChart from "@/components/RedFlagChart";

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
type RedFlagClause = {
  clause: string;
  finalText: string;
  riskScore: number;
  x: number;
  y: number;
};

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);
  const router = useRouter();
  const [isThoughtsExpaned, setIsThoughtsExpaned] = React.useState(false);
  const [redFlagClauses, setRedFlagClauses] = useState<RedFlagClause[]>([]);



  const { addSources, selectedSource, setSelectedSource } = useSources();
  console.log("[Chat] selectedSource", selectedSource)
    const handleClosePdf = () => {
    setSelectedSource(null)
  }

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

  // const formatTimestamp = (date: Date) => {
  //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

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
          url: URL.createObjectURL(file),
        }));
        console.log("[Chat] newSources", newSources)
        addSources(newSources);
      }

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Add initial delay before showing first thinking message
      const initialDelay = 1000; // 1 second delay
      const phraseDisplayTime = 15000; // 3 seconds per phrase

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

        // Add final bot response after all thinking phrases
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
        }, phraseDisplayTime * THINKING_PHRASES.length + 500); // Slight delay after last thinking phrase

        timeoutRef.current.push(finalTimeoutId);
      }, initialDelay);

      timeoutRef.current.push(initialTimeoutId);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[Chat] handleFileChange", e)
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      handleUpload(files);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
    const handleUpload = async (files: File[]) => {
    if (files.length > 0) {
      try {
        console.log("[Chat] Starting File Upload")
        // Show initial thinking message
        const thinkingMessage: Message = {
          sender: "bot",
          text: THINKING_PHRASES[0],
          isThinking: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, thinkingMessage]);

        // Start analysis
        const { job_id } = await analyzeContract(files[0]);
        
        // Poll for status

        const pollInterval = setInterval(async () => {
          console.log("[Chat] Polling for status")
          try {
            const { status } = await getAnalysisStatus(job_id);
            console.log("[Chat] status", status)
            
            if (status === 'completed') {
              console.log("[Chat] Analysis completed")
              clearInterval(pollInterval);
              const analysisResult = await getAnalysisResult(job_id);
                          // Check if 'result' exists
            if (!analysisResult || !analysisResult.results) {
              throw new Error("Invalid API response: 'result' field is missing.");
            }
            const redFlagClauses = analysisResult.results
              .filter(clause => clause.red_flag === "RED_FLAG" && clause.risk_score > 50)
              .map(clause => ({
                clause: clause.clause,
                finalText: clause.final_text,
                riskScore: clause.risk_score,
                x: clause.x,
                y: clause.y
              }));

            console.log("[Chat] redFlagClauses", redFlagClauses);
            setRedFlagClauses(redFlagClauses);
        // Create a formatted message
        // Updated message format with HTML for styling
const message = `
              <div class="${styles.analysisResults}">
                <h1 class="${styles.analysisHeading}">Red Flag Clauses</h1>
                <div class="${styles.analysisContent}">
                  ${redFlagClauses.map((clause, index) => 
                    `<div class="${styles.listItem}">
                      <strong>Clause:</strong> ${clause.clause}<br/>
                      <strong>Risk Score:</strong> ${clause.riskScore}
                    </div>`
                  ).join('')}
                </div>
              </div>`;
 





              
              // Update messages with final result
              setMessages(prev => {
                const messagesWithoutThinking = prev.filter(msg => !msg.isThinking);
                return [
                  ...messagesWithoutThinking,
                  {
                    sender: "bot",
                    text: message,// Format result as needed
                    timestamp: new Date(),
                  }
                ];
              });
            } else if (status === 'failed') {
              clearInterval(pollInterval);
              throw new Error('Analysis failed');
            } else {
              // Update thinking message with next phrase
              setMessages(prev => {
                const currentIndex = THINKING_PHRASES.findIndex(
                  phrase => prev[prev.length - 1].text.startsWith(phrase)
                );
                const nextIndex = (currentIndex + 1) % THINKING_PHRASES.length;
                
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1] = {
                  ...updatedMessages[updatedMessages.length - 1],
                  text: THINKING_PHRASES[nextIndex],
                };
                return updatedMessages;
              });
            }
          } catch (error) {
            clearInterval(pollInterval);
            console.error('Error polling status:', error);
          }
        }, 1000); // Poll every second

        // Add sources to context
        const newSources = files.map(file => ({
          id: uuidv4(),
          name: file.name,
          uploadTime: new Date(),
          url: URL.createObjectURL(file),
        }));
        addSources(newSources);
        setSelectedSource(newSources[0]);

      } catch (error) {
        console.error('Error processing file:', error);
        // Show error message to user
        setMessages(prev => [
          ...prev.filter(msg => !msg.isThinking),
          {
            sender: "bot",
            text: "Sorry, there was an error processing your file.",
            timestamp: new Date(),
          }
        ]);
      }
    }
  };
  const handleAskAI = () => {
    router.push('/ask-ai');
  }

 return (
    <div className={styles.chatContainer}>
      <div className="h-full flex">
        {/* Chat Section */}
        <div className={selectedSource ? "w-1/2 flex flex-col" : "w-full flex flex-col"}>
          {/* Messages and Input Container */}
          <div className="flex flex-col h-full">
            {/* Messages Container */}
            <div className={`${styles.messagesContainer} flex-1 overflow-y-auto`}>
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
                                typeSpeed={70}
                                deleteSpeed={200}
                                delaySpeed={100}
                              /> 
                            ) : (
                              <div 
                               className={styles.typewriterContainer}
                               dangerouslySetInnerHTML={{
                                __html: message.text
                               }}
                              /> 
                            )
                          ) : (
                            <p className={styles.messageText}>{message.text}</p>
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
                    {/* Render the Chart if there are red flag clauses */}
          {redFlagClauses.length > 0 && (
            <div className={styles.chartContainer}>
              <RedFlagChart data={redFlagClauses} />
            </div>
          )}

            {/* Input Container */}
            <div className={`${styles.inputContainer} bg-background`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="application/pdf"
              />
              <div className="flex items-center justify-between w-full gap-3 ">
              <Button 
                variant="ghost"
                size="icon"
                className={styles.attachButton}
                onClick={handleFileClick}
              >
                <Files className="h-4 w-4" /> Upload Document
              </Button>

              {selectedFiles.length > 0 && (
                <Button 
                  variant="ghost"
                  size="icon"
                  className={styles.deleteButton}
                  onClick={handleClearFiles}
                >
                  {/* <Trash2 className="h-4 w-4 text-red-500" /> */}
                </Button>
              )}
              
        
              <Button 
                onClick={handleAskAI}
                className={styles.askAIButton}
                variant="default"
              >
                {/* <SendHorizontal className="h-4 w-4 text-white" /> */}
                Ask AI
              </Button></div> 
            </div>
          </div>
        </div>

        {/* PDF Viewer Section */}
        {selectedSource && (
          <div className="w-1/2 h-full border-l border-gray-300">
            <PdfViewer url={selectedSource.url} onClose={handleClosePdf} />
          </div>
        )}
      </div>
    </div>
  );
}