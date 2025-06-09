import React, { useRef, useState, useEffect } from "react";
import { fetchPerplexityChat } from "../api/perplexity";
import ReactMarkdown from 'react-markdown';

const DEFAULT_POSITION = {
  x: window.innerWidth - 340 - 16,
  y: window.innerHeight - 550 - 40,
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export default function Chatbot({ onClose }: { onClose: () => void }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isResetting, setIsResetting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '아이티센의 마스코트, 세니입니다! 무엇을 도와드릴까요?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('.');
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const lastTouchPos = useRef(DEFAULT_POSITION);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  // 로딩 애니메이션
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '.';
          if (prev === '..') return '...';
          if (prev === '.') return '..';
          return '.';
        });
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // 답변 생성 시 스크롤
  useEffect(() => {
    if (isLoading) {
      // 로딩 중일 때는 맨 아래로 스크롤
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setTimeout(() => {
          if (chatContainerRef.current) {
            const currentScroll = chatContainerRef.current.scrollTop;
            chatContainerRef.current.scrollTo({
              top: currentScroll + 210,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    }
  }, [isLoading, messages]);

  // 터치 드래그 (헤더에서만 시작)
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    setIsResetting(false); // 드래그 시작 시 애니메이션 제거
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    lastTouchPos.current = position;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newPos = {
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    };
    setPosition(newPos);
    lastTouchPos.current = newPos;
  };
  const onTouchEnd = () => {
    dragging.current = false;
    // 화면 밖이면 기본 위치로 복귀 (애니메이션 적용)
    const width = window.innerWidth;
    const height = window.innerHeight;
    const boxWidth = 340;
    const boxHeight = 400;
    const pos = lastTouchPos.current;
    if (
      pos.x < 0 ||
      pos.y < 0 ||
      pos.x + boxWidth > width ||
      pos.y + boxHeight > height
    ) {
      setIsResetting(true);
      setPosition(DEFAULT_POSITION);
    }
  };

  // 애니메이션 끝나면 transition 제거
  const handleTransitionEnd = () => {
    if (isResetting) setIsResetting(false);
  };

  const handleSendMessage = async (message: string) => {
    if (isLoading) return;
    if (!message.trim()) return;

    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
    setIsLoading(true);

    try {
      // API 호출
      const response = await fetchPerplexityChat(message);
      
      // 응답 메시지 추가
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content,
        citations: response.citations
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 응답을 받아오는데 실패했습니다.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = () => {
    if (input.trim()) {
      handleSendMessage(input.trim());
    }
  };

  const handleButtonClick = (message: string) => {
    handleSendMessage(message);
  };

  return (
    <div
      ref={chatWindowRef}
      className={`w-[340px] h-[430px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-100${isResetting ? ' transition-all duration-300' : ''}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* 상단 바 (드래그 핸들) */}
      <div
        className="flex items-center justify-center relative bg-[#5382E0] px-4 py-3 cursor-move select-none touch-none overscroll-contain"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <span className="text-white text-xl font-bold">CENI</span>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold focus:outline-none"
          aria-label="챗봇 닫기"
        >
          ×
        </button>
      </div>

      {/* 채팅 영역 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 px-4 py-3 bg-[#f7faff] overflow-y-auto" 
        style={{ 
        }}
      >
        {/* 메시지 목록 */}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : ''} ${index === 0 ? '' : 'mt-5'}`}>
            {message.role === 'assistant' && (
              <img src="/ceni-face.webp" alt="CENI" className="h-7 mr-2 object-cover" />
            )}
            <div>
              <div className={`${
                message.role === 'user' 
                  ? 'bg-[#5382E0] text-white rounded-xl rounded-tr-none' 
                  : 'bg-[#e6edfa] text-gray-900 rounded-xl rounded-tl-none'
              } px-4 py-2 text-sm max-w-[220px] ${index === 0 ? 'mb-4' : ''}`}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-0">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => <code className="bg-gray-100 rounded px-1">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-100 rounded p-2 my-2 overflow-x-auto">{children}</pre>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content.replace(/\[(\d+)\]/g, (match, number) => {
                    const citation = message.citations?.[parseInt(number) - 1];
                    if (citation) {
                      return `[[${number}]](${citation})`;
                    }
                    return match;
                  })}
                </ReactMarkdown>
              </div>
              {/* 첫 번째 메시지(인트로) 아래에 버튼들 추가 */}
              {index === 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <button 
                    onClick={() => handleButtonClick('가장 빠른 셔틀 출발 시간이 궁금해요')}
                    className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-pointer"
                  >
                    가장 빠른 셔틀 출발 시간
                  </button>
                  <button 
                    onClick={() => handleButtonClick('셔틀 정류장 위치가 어디인가요?')}
                    className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-pointer"
                  >
                    셔틀 정류장 위치
                  </button>
                  <button 
                    onClick={() => handleButtonClick('셔틀 배차 간격이 어떻게 되나요?')}
                    className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-pointer"
                  >
                    셔틀 배차 간격
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex mt-5">
            <img src="/ceni-face.webp" alt="CENI" className="h-7 mr-2 object-cover" />
            <div className="bg-[#e6edfa] text-gray-900 rounded-xl rounded-tl-none px-4 py-2 text-sm">
              {loadingDots}
            </div>
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="flex items-center px-3 py-2 bg-white">
        <input
          className="flex-1 min-w-0 px-3 py-2 mr-4 rounded-lg border border-gray-200 text-sm focus:outline-none"
          placeholder="세니에게 질문해 보세요!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
        />
        <button 
          onClick={handleInputSubmit}
          disabled={isLoading || !input.trim()}
          className="disabled:opacity-50"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={!isLoading && input.trim() ? "text-[#5382E0]" : "text-gray-400"}
          >
            <path 
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" 
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
