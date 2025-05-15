"use client"

import { useRef, useEffect, useState } from "react"

interface TerminalProps {
  commands: string[]
  isRunning: boolean
  progress: number
  autoScroll?: boolean
}

export function Terminal({ commands, isRunning, progress, autoScroll = true }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [blinkCursor, setBlinkCursor] = useState(true)
  const [prevCommands, setPrevCommands] = useState<string[]>([])
  const [prevProgress, setPrevProgress] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

  // Reset terminal when commands change
  useEffect(() => {
    if (JSON.stringify(commands) !== JSON.stringify(prevCommands)) {
      setVisibleLines([])
      setCurrentLineIndex(0)
      setCurrentCharIndex(0)
      setPrevCommands(commands)
    }
  }, [commands, prevCommands])

  // Handle typing effect
  useEffect(() => {
    if (!isRunning || !commands || commands.length === 0 || progress === prevProgress) return

    setPrevProgress(progress)

    const totalLines = commands.length
    const progressPercentPerLine = 100 / totalLines
    const targetLineIndex = Math.min(Math.floor(progress / progressPercentPerLine), totalLines - 1)

    // If we need to show a new line
    if (currentLineIndex < targetLineIndex) {
      // Add the complete current line
      if (currentLineIndex < commands.length) {
        setVisibleLines((prev) => {
          const newLines = [...prev]
          newLines[currentLineIndex] = commands[currentLineIndex]
          return newLines
        })
      }

      // Move to next line
      setCurrentLineIndex(targetLineIndex)
      setCurrentCharIndex(0)
    }
    // If we're on the current target line, type it character by character
    else if (currentLineIndex === targetLineIndex) {
      const currentLine = commands[currentLineIndex] || ""
      const progressWithinLine = (progress % progressPercentPerLine) / progressPercentPerLine
      const targetCharIndex = Math.floor(progressWithinLine * currentLine.length)

      if (currentCharIndex < targetCharIndex) {
        setCurrentCharIndex(targetCharIndex)
        setVisibleLines((prev) => {
          const newLines = [...prev]
          newLines[currentLineIndex] = currentLine.substring(0, targetCharIndex)
          return newLines
        })
      }
    }

    // Handle auto-scrolling
    if (terminalRef.current && autoScroll) {
      smoothScrollToBottom()
    }
  }, [commands, currentLineIndex, currentCharIndex, isRunning, progress, prevProgress, autoScroll])

  // Blink cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Smooth scroll to bottom function
  const smoothScrollToBottom = () => {
    if (!terminalRef.current || isAutoScrolling) return;
    
    setIsAutoScrolling(true);
    
    const targetScrollTop = terminalRef.current.scrollHeight - terminalRef.current.clientHeight;
    const startScrollTop = terminalRef.current.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    
    // Skip animation for small changes
    if (Math.abs(distance) < 50) {
      terminalRef.current.scrollTop = targetScrollTop;
      setIsAutoScrolling(false);
      return;
    }
    
    const duration = 300; // ms
    const startTime = performance.now();
    
    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      if (terminalRef.current) {
        terminalRef.current.scrollTop = startScrollTop + distance * easedProgress;
      }
      
      if (progress < 1 && terminalRef.current) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsAutoScrolling(false);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  // Handle manual scroll
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    
    // This is important for mobile - ensures scrolling works properly on touch devices
    terminal.style.overscrollBehavior = 'contain';
    
    // When user manually scrolls, temporarily disable auto-scrolling
    const handleScroll = () => {
      if (isAutoScrolling) return;
      
      const isScrolledToBottom = 
        Math.abs(terminal.scrollHeight - terminal.clientHeight - terminal.scrollTop) < 50;
        
      if (isScrolledToBottom && progress === 100) {
        smoothScrollToBottom();
      }
    };
    
    terminal.addEventListener('scroll', handleScroll);
    
    return () => {
      terminal.removeEventListener('scroll', handleScroll);
    };
  }, [progress, isAutoScrolling]);

  // Auto-scroll to bottom when demo completes
  useEffect(() => {
    if (progress === 100 && terminalRef.current) {
      setTimeout(() => smoothScrollToBottom(), 300);
    }
  }, [progress]);

  return (
    <div
      ref={terminalRef}
      className="bg-black text-green-500 font-mono p-4 h-full overflow-auto custom-scrollbar relative"
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "14px",
        lineHeight: "1.5",
        WebkitOverflowScrolling: "touch", // Helps with mobile scrolling
      }}
    >
      {visibleLines.map((line, index) => (
        <div key={index} className="mb-1">
          {line && line.startsWith("#") ? <span className="text-gray-500">{line}</span> : <span>{line}</span>}
        </div>
      ))}

      {isRunning && commands && commands.length > 0 && currentLineIndex < commands.length && (
        <div className="mb-1">
          {commands[currentLineIndex] && commands[currentLineIndex].startsWith("#") ? (
            <span className="text-gray-500">
              {commands[currentLineIndex].substring(0, currentCharIndex)}
              {blinkCursor && <span className="animate-pulse">▌</span>}
            </span>
          ) : (
            <span>
              {commands[currentLineIndex] ? commands[currentLineIndex].substring(0, currentCharIndex) : ""}
              {blinkCursor && <span className="animate-pulse">▌</span>}
            </span>
          )}
        </div>
      )}

      {(!isRunning || !commands || commands.length === 0) && progress === 0 && (
        <div className="text-gray-500 italic">Click "Run Demo" to start the demonstration...</div>
      )}
    </div>
  )
}
