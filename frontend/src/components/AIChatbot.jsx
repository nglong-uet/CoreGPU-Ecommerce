import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../style/AIChatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Chào mừng bạn đến với Hỗ trợ AI! 👋\nBạn có thể hỏi tôi bất kỳ điều gì về sản phẩm hoặc dịch vụ của CoreGPU.`
        }
      ]);
    }
  };

  const sendMessage = async (text) => {
    const content = text || input;
    if (!content.trim()) return;

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');

    // Tin nhắn tạm trong khi chờ GPT trả lời
    setMessages(prev => [...prev, { role: 'assistant', content: 'Đang xử lý...' }]);

    try {
      const response = await axios.post("http://localhost:8080/api/chat", {
        model: "gpt-3.5-turbo",
        messages: newMessages,
      });

      const reply = response.data; // {role, content}

      // Xóa "Đang xử lý..." và thêm câu trả lời thật
      setMessages([...newMessages, reply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: 'assistant', content: "Đã xảy ra lỗi. Vui lòng thử lại sau!" }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={handleOpenChat}>
          <img src="/icons/bot-logo.svg" alt="Bot" className="bot-logo-svg" />
        </button>
      )}

      {isOpen && (
        <div className="chatbox light">
          <div className="chat-header">
            <span>CoreGPU Assistant</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <img src="/icons/bot-logo.svg" alt="bot" className="avatar" />
                ) : (
                  <div className="spacer" />
                )}
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-buttons">
            {['Tư vấn', 'Hỗ trợ'].map((label, i) => (
              <button key={i} onClick={() => sendMessage(label)}>
                {label}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập ở đây..."
            />
            <button onClick={() => sendMessage()}>
              <span style={{ transform: 'rotate(-90deg)', display: 'inline-block' }}>➤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
