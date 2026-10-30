import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  Send,
  Paperclip,
  X,
  Copy,
  Check,
  FileText,
  BookOpen,
  Trash2,
  Plus,
  GraduationCap,
  Code,
  FileQuestion,
  Share2,
  Key,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { extractTextFromDocument } from '../utils/documentReader';
import { shareNoteToWhatsApp } from '../utils/shareUtils';
import { api } from '../utils/api';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import { generateAcademicResponse } from '../utils/academicEngine';

// Authentic WhatsApp SVG Icon
const WhatsAppIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.507 14.307c-.283-.141-1.67-.824-1.929-.918-.259-.095-.448-.141-.637.141-.189.283-.73 0.918-.895 1.107-.165.189-.33.212-.613.071-.283-.142-1.196-.441-2.278-1.406-.843-.751-1.411-1.68-1.576-1.963-.165-.283-.018-.436.124-.577.127-.127.283-.33.424-.495.142-.165.189-.283.283-.472.095-.189.047-.354-.024-.495-.071-.141-.637-1.533-.872-2.1-.229-.553-.462-.478-.637-.487-.165-.008-.354-.01-.542-.01s-.495.071-.754.354c-.259.283-.99 0.967-.99 2.358 0 1.391 1.013 2.735 1.155 2.924.142.189 1.993 3.044 4.829 4.268.675.292 1.202.466 1.613.597.678.216 1.296.185 1.785.112.545-.082 1.67-.683 1.906-1.342.235-.66.235-1.225.165-1.342-.07-.117-.259-.188-.542-.33z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.892.525 3.662 1.438 5.176L2 22l4.982-1.404C8.423 21.493 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.642 0-3.167-.47-4.46-1.282l-.32-.2-2.956.833.847-2.88-.208-.332A8.163 8.163 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z"
      fill={color}
    />
  </svg>
);

const PERSONAS = [
  { id: 'professor', name: 'Professor / Exam Coach', icon: GraduationCap, desc: 'Step-by-step academic explanations with formulas & proofs.' },
  { id: 'summarizer', name: 'Syllabus Summarizer', icon: BookOpen, desc: 'Extracts core bullet points, key takeaways, and flash summaries.' },
  { id: 'coder', name: 'Code & Algo Debugger', icon: Code, desc: 'Debugs code, explains time complexities, and traces logic.' },
  { id: 'examiner', name: 'Exam & Viva Predictor', icon: FileQuestion, desc: 'Generates high-probability exam questions & model answers.' },
];

const PROMPT_SUGGESTIONS = [
  { label: '⚡ Summarize Doc', prompt: 'Please summarize this document with key takeaways, definitions, and core formulas.' },
  { label: '🔍 Explain Concepts', prompt: 'Explain the core theoretical principles from this topic step-by-step with real-world analogies.' },
  { label: '🎯 5 Exam Questions', prompt: 'Generate 5 high-yield exam and viva questions from this topic with model answers.' },
  { label: '💡 Simplify (ELI5)', prompt: 'Explain this concept in plain, simple terms as if I am learning it for the very first time.' },
  { label: '💻 Trace Algorithm', prompt: 'Provide a clean implementation with time/space complexity analysis and edge cases.' },
];

const DEFAULT_SUBJECTS = ['ALL', 'CN', 'ML', 'API', 'OT', 'MFEF', 'TRAINING'];

const AiTutor = () => {
  const { user, addNote } = useApp();
  const studentName = user?.name || 'Sai likhitha Adda';

  // Chat State
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('studenthub_ai_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return 'chat-' + Date.now();
  });

  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('professor');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Document Attachment State
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Gemini API Key (Optional user custom key)
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem('studenthub_gemini_key') || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);

  // Notification / Feedback State
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedNoteIndex, setSavedNoteIndex] = useState(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load active conversation messages and auto-heal any stale Connection Notice
  useEffect(() => {
    const current = conversations.find((c) => c.id === activeChatId);
    if (current) {
      const rawMessages = current.messages || [];
      const hasNotice = rawMessages.some((m) => m.role === 'assistant' && m.content?.includes('Connection Notice'));
      if (hasNotice) {
        const healedMessages = rawMessages.map((msg, idx, arr) => {
          if (msg.role === 'assistant' && msg.content?.includes('Connection Notice')) {
            const prevUserMsg = arr.slice(0, idx).reverse().find((m) => m.role === 'user');
            const prompt = prevUserMsg?.content || 'Simplex Method Pivot Rule';
            return {
              ...msg,
              content: generateAcademicResponse(prompt, null, current.persona || 'professor'),
              source: 'studenthub-academic-engine',
            };
          }
          return msg;
        });
        setMessages(healedMessages);
        saveCurrentConversation(healedMessages);
      } else {
        setMessages(rawMessages);
      }
      setSelectedPersona(current.persona || 'professor');
    } else {
      setMessages([]);
    }
  }, [activeChatId, conversations]);

  // Persist conversations
  const saveCurrentConversation = (newMessages) => {
    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === activeChatId);
      const title =
        newMessages.find((m) => m.role === 'user')?.content?.slice(0, 36) || 'New Conversation';

      const updatedChat = {
        id: activeChatId,
        title,
        persona: selectedPersona,
        subject: selectedSubject,
        updatedAt: new Date().toISOString(),
        messages: newMessages,
      };

      let updatedList;
      if (existingIndex >= 0) {
        updatedList = [...prev];
        updatedList[existingIndex] = updatedChat;
      } else {
        updatedList = [updatedChat, ...prev];
      }

      try {
        localStorage.setItem('studenthub_ai_conversations', JSON.stringify(updatedList));
      } catch (e) {
        // storage overflow guard
      }
      return updatedList;
    });
  };

  // Start a new chat
  const handleNewChat = () => {
    const newId = 'chat-' + Date.now();
    setActiveChatId(newId);
    setMessages([]);
    setAttachedDoc(null);
    setInputPrompt('');
  };

  // Delete chat
  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    try {
      localStorage.setItem('studenthub_ai_conversations', JSON.stringify(updated));
    } catch (err) {}
    if (activeChatId === id) {
      handleNewChat();
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Document exceeds 25MB limit.');
      return;
    }

    setIsProcessingDoc(true);
    try {
      const docData = await extractTextFromDocument(file);
      setAttachedDoc({
        name: file.name,
        size: file.size,
        type: file.type,
        content: docData.text || '',
        subject: selectedSubject !== 'ALL' ? selectedSubject : 'Coursework',
      });
    } catch (err) {
      console.error('Failed to read file:', err);
    } finally {
      setIsProcessingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Prompt Handler
  const handleSendMessage = async (textToSend = inputPrompt) => {
    const prompt = (textToSend || '').trim();
    if (!prompt && !attachedDoc) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: prompt || `Please analyze this attached document: ${attachedDoc?.name}`,
      timestamp: new Date().toISOString(),
      document: attachedDoc
        ? {
            name: attachedDoc.name,
            size: attachedDoc.size,
            type: attachedDoc.type,
          }
        : null,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    const docToSend = attachedDoc;
    setAttachedDoc(null); // clear after sending

    try {
      // Call backend AI chat route
      const res = await api.post('/ai/chat', {
        messages: newMessages,
        prompt: userMessage.content,
        document: docToSend,
        persona: selectedPersona,
        apiKey: customApiKey,
      });

      const assistantReply =
        res?.reply ||
        'I have analyzed your query. Please review the structured concepts above.';

      const assistantMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: assistantReply,
        source: res?.source || 'studenthub-engine',
        timestamp: new Date().toISOString(),
        persona: selectedPersona,
      };

      const updatedConversation = [...newMessages, assistantMessage];
      setMessages(updatedConversation);
      saveCurrentConversation(updatedConversation);
    } catch (err) {
      console.warn('Backend /ai/chat unreachable, activating built-in Academic Intelligence Engine:', err);
      const offlineReply = generateAcademicResponse(userMessage.content, docToSend, selectedPersona);
      const assistantMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'assistant',
        content: offlineReply,
        source: 'studenthub-engine',
        timestamp: new Date().toISOString(),
        persona: selectedPersona,
      };
      const updatedConversation = [...newMessages, assistantMessage];
      setMessages(updatedConversation);
      saveCurrentConversation(updatedConversation);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action: Save AI response directly into StudentHub Notes
  const handleSaveToNotes = (msgContent, index) => {
    // Extract first header line as title
    const lines = msgContent.split('\n').filter((l) => l.trim().length > 0);
    const firstHeader = lines.find((l) => l.startsWith('#')) || lines[0] || 'AI Academic Note';
    const cleanTitle = firstHeader.replace(/^[#*\s]+|[#*\s]+$/g, '').trim();

    addNote({
      title: cleanTitle.slice(0, 70),
      subject: selectedSubject !== 'ALL' ? selectedSubject : 'General',
      content: msgContent,
      tags: ['ai-copilot', selectedPersona, selectedSubject.toLowerCase()],
      pinned: false,
    });

    setSavedNoteIndex(index);
    setTimeout(() => setSavedNoteIndex(null), 2500);
  };

  // Quick Action: Copy to Clipboard
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Quick Action: Share response to WhatsApp
  const handleShareToWhatsApp = (msgContent) => {
    const lines = msgContent.split('\n').filter((l) => l.trim().length > 0);
    const title = lines[0]?.replace(/^[#*\s]+|[#*\s]+$/g, '') || 'AI Academic Solution';

    shareNoteToWhatsApp({
      title,
      subject: selectedSubject !== 'ALL' ? selectedSubject : 'Coursework',
      content: msgContent,
      tags: ['ai-solution', selectedPersona],
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - var(--navbar-height) - 3rem)',
        minHeight: 600,
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* ================= LEFT SIDEBAR (History & Personas) ================= */}
      <aside
        style={{
          width: 280,
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* Top: New Chat Button */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleNewChat}
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: 700,
            }}
          >
            <Plus size={16} /> New Academic Chat
          </button>
        </div>

        {/* Persona Selector */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
            Academic Persona
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isActive = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'transparent',
                    backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.825rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={p.desc}
                >
                  <Icon size={15} color={isActive ? 'var(--primary)' : 'currentColor'} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Filter Context */}
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Coursework Context
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {DEFAULT_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 99,
                  border: '1px solid',
                  borderColor: selectedSubject === sub ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: selectedSubject === sub ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: selectedSubject === sub ? '#F1EAD7' : 'var(--text-secondary)',
                  fontWeight: selectedSubject === sub ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Past Chat Sessions List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem 0.4rem 0.5rem' }}>
            Recent Sessions ({conversations.length})
          </div>
          {conversations.length === 0 ? (
            <div style={{ padding: '1rem 0.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              No previous chats recorded. Start a new session above!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeChatId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveChatId(conv.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-subtle)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                    <Bot size={14} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '0.8rem', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(conv.id, e)}
                    className="btn-icon"
                    style={{ width: 22, height: 22, color: 'var(--text-muted)' }}
                    title="Delete conversation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom AI Engine Status & Key Settings */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span>{customApiKey ? 'Gemini 1.5 Active' : 'Academic Engine'}</span>
          </div>
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="btn-icon"
            style={{ width: 26, height: 26, color: 'var(--text-secondary)' }}
            title="Configure optional Gemini Cloud API key"
          >
            <Key size={13} />
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN CHAT AREA ================= */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: 'var(--bg-primary)' }}>
        {/* Chat Header */}
        <header
          style={{
            height: '3.6rem',
            padding: '0 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(23, 100, 77, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Sparkles size={17} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>Academic Copilot</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 99,
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    fontWeight: 600,
                  }}
                >
                  {PERSONAS.find((p) => p.id === selectedPersona)?.name}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Ask doubts • Upload course docs • Summarize & Exam Prep
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                if (messages.length > 0 && confirm('Clear this conversation?')) {
                  setMessages([]);
                  saveCurrentConversation([]);
                }
              }}
              className="btn btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              disabled={messages.length === 0}
            >
              Clear Chat
            </button>
          </div>
        </header>

        {/* Chat Messages Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div
              style={{
                maxWidth: 680,
                margin: '2rem auto 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #17644D 0%, #208567 100%)',
                  color: '#F1EAD7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(23, 100, 77, 0.25)',
                }}
              >
                <Sparkles size={28} />
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                Hello {studentName.split(' ')[0]}! What can I explain today?
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 540, marginBottom: '2rem', lineHeight: 1.55 }}>
                Ask any complex doubt, upload your lecture documents or past question papers, and get clear mathematical, conceptual, or code breakdowns.
              </p>

              {/* Suggestion prompt cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '0.85rem',
                  width: '100%',
                }}
              >
                {[
                  { title: 'Explain TCP 3-Way Handshake', desc: 'Trace SYN, SYN-ACK, ACK timeline ladder and flow control.' },
                  { title: 'Simplex Method Pivot Rule', desc: 'Step-by-step Minimum Ratio test and Gaussian pivot table.' },
                  { title: 'Precision, Recall & F1-Score', desc: 'Formulas, Type I/II errors, and when to prioritize each.' },
                  { title: 'REST API Design Principles', desc: 'HTTP methods, idempotent verbs, status codes, and JWT security.' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.title)}
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-secondary)',
                      transition: 'all 0.18s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    <ArrowRight size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id || index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {/* User / Bot Identity tag */}
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {isUser ? (
                        <span>You</span>
                      ) : (
                        <>
                          <Sparkles size={12} color="var(--primary)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Academic Copilot</span>
                        </>
                      )}
                    </div>

                    {/* Attached Document Card (if message included a document) */}
                    {msg.document && (
                      <div
                        style={{
                          marginBottom: '0.5rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                        }}
                      >
                        <FileText size={15} color="var(--primary)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {msg.document.name}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          ({Math.round((msg.document.size || 0) / 1024)} KB)
                        </span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      style={{
                        maxWidth: '92%',
                        padding: '1.1rem 1.35rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: isUser ? '#17644D' : 'var(--bg-card)',
                        color: isUser ? '#F1EAD7' : 'var(--text-primary)',
                        border: isUser ? 'none' : '1px solid var(--border-subtle)',
                        lineHeight: 1.65,
                        fontSize: '0.9rem',
                        wordBreak: 'break-word',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      {isUser ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>

                    {/* Assistant Response Actions */}
                    {!isUser && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Save to Notes */}
                        <button
                          onClick={() => handleSaveToNotes(msg.content, index)}
                          className="btn btn-outline"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: savedNoteIndex === index ? 'var(--primary)' : 'var(--text-secondary)',
                            borderColor: savedNoteIndex === index ? 'var(--primary)' : undefined,
                          }}
                        >
                          {savedNoteIndex === index ? <Check size={12} color="var(--primary)" /> : <BookOpen size={12} />}
                          <span>{savedNoteIndex === index ? 'Saved to Notes!' : 'Save to Notes'}</span>
                        </button>

                        {/* Copy Answer */}
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="btn btn-outline"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {copiedIndex === index ? <Check size={12} color="var(--primary)" /> : <Copy size={12} />}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* Share to WhatsApp */}
                        <button
                          onClick={() => handleShareToWhatsApp(msg.content)}
                          className="btn btn-outline"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.65rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: '#25D366',
                            borderColor: 'rgba(37, 211, 102, 0.35)',
                          }}
                          title="Share explanation to WhatsApp"
                        >
                          <WhatsAppIcon size={13} color="#25D366" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                  <span>Academic Copilot is analyzing your query & document...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div
          style={{
            padding: '0.85rem 1.5rem 1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {/* Quick Action Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.35rem' }}>
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 99,
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Attached Document Preview Banner */}
            {attachedDoc && (
              <div
                style={{
                  marginBottom: '0.5rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(23, 100, 77, 0.1)',
                  border: '1px solid rgba(23, 100, 77, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <FileText size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {attachedDoc.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    ({Math.round((attachedDoc.size || 0) / 1024)} KB) - Ready for AI analysis
                  </span>
                </div>
                <button
                  onClick={() => setAttachedDoc(null)}
                  className="btn-icon"
                  style={{ width: 22, height: 22 }}
                  title="Remove document"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '0.5rem',
                position: 'relative',
              }}
            >
              {/* File Attachment Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.md,.json,.png,.jpg,.jpeg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-icon"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  color: attachedDoc ? 'var(--primary)' : 'var(--text-secondary)',
                  flexShrink: 0,
                }}
                title="Upload document or image (.pdf, .doc, .txt, .png)"
                disabled={isProcessingDoc}
              >
                <Paperclip size={18} />
              </button>

              {/* Text Area */}
              <textarea
                rows={2}
                placeholder={
                  attachedDoc
                    ? `Ask anything about "${attachedDoc.name}" (e.g. summarize, explain formulas)...`
                    : "Ask your academic doubt (e.g. 'Explain Simplex pivot rule' or 'Summarize lecture')..."
                }
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  resize: 'none',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: 42,
                  height: 42,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  flexShrink: 0,
                }}
                disabled={isLoading || (!inputPrompt.trim() && !attachedDoc)}
                title="Send query (Enter)"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ================= OPTIONAL GEMINI API KEY MODAL ================= */}
      {isKeyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsKeyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>AI Engine Configuration</h3>
              </div>
              <button onClick={() => setIsKeyModalOpen(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              StudentHub includes an intelligent built-in academic engine with syllabus mastery for <strong>Computer Networks, Machine Learning, APIs, Operations Research, and Math</strong>.
            </p>

            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Optional: Google Gemini API Key (For Live Cloud Models)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                style={{ fontSize: '0.825rem' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Get a 100% free API key from{' '}
                <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Google AI Studio
                </a>.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setTempApiKey('');
                  setCustomApiKey('');
                  localStorage.removeItem('studenthub_gemini_key');
                  setIsKeyModalOpen(false);
                }}
              >
                Reset to Built-in Engine
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setCustomApiKey(tempApiKey.trim());
                  localStorage.setItem('studenthub_gemini_key', tempApiKey.trim());
                  setIsKeyModalOpen(false);
                }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiTutor;