import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Smile, Image, Paperclip, MoreVertical, 
  Phone, Video, Users, X, Maximize, Minimize, Bell, Settings,
  Flag, Trash2, Copy, Reply, Heart, Star, Pin, Search, Filter
} from 'lucide-react';

type MessageType = 'text' | 'image' | 'system' | 'poll' | 'report';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  type: MessageType;
  reactions?: { emoji: string; count: number; users: string[] }[];
  replyTo?: { id: string; userName: string; content: string };
  isPinned?: boolean;
  pollData?: { question: string; options: { text: string; votes: number }[] };
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: 'admin' | 'moderator' | 'member' | 'vip';
}

interface LiveChatProps {
  roomId: string;
  roomName: string;
  movieTitle?: string;
  isWatchParty?: boolean;
}

export default function LiveChat({ roomId, roomName, movieTitle, isWatchParty = false }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'system',
      userName: 'System',
      userAvatar: '',
      content: `Selamat datang di ${roomName}! 🎬`,
      timestamp: new Date(),
      type: 'system'
    },
    {
      id: '2',
      userId: 'user1',
      userName: 'CinemaLover',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CinemaLover',
      content: 'Halo semua! Siap nonton bareng? 🍿',
      timestamp: new Date(Date.now() - 60000),
      type: 'text',
      reactions: [{ emoji: '👋', count: 5, users: [] }]
    },
    {
      id: '3',
      userId: 'user2',
      userName: 'MovieBuff',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff',
      content: 'Film ini bagus banget! Rating 9/10 dari saya 🌟',
      timestamp: new Date(Date.now() - 30000),
      type: 'text',
      reactions: [{ emoji: '❤️', count: 12, users: [] }, { emoji: '🔥', count: 8, users: [] }]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([
    { id: '1', name: 'CinemaLover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CinemaLover', isOnline: true, role: 'vip' },
    { id: '2', name: 'MovieBuff', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff', isOnline: true, role: 'member' },
    { id: '3', name: 'FilmCritic', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FilmCritic', isOnline: true, role: 'moderator' },
  ]);
  const [showUserList, setShowUserList] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emojis = ['😀', '😂', '🥰', '😍', '🤩', '😎', '🤔', '😢', '😱', '🔥', '❤️', '👍', '👎', '👏', '🎬', '🍿', '⭐', '🌟'];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      userId: 'me',
      userName: 'Anda',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      replyTo: replyingTo ? { id: replyingTo.id, userName: replyingTo.userName, content: replyingTo.content } : undefined
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, users: [] }]
          };
        }
      }
      return msg;
    }));
  };

  const createPoll = () => {
    const pollMessage: Message = {
      id: Date.now().toString(),
      userId: 'me',
      userName: 'Anda',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: '',
      timestamp: new Date(),
      type: 'poll',
      pollData: {
        question: 'Rating film ini?',
        options: [
          { text: '⭐⭐⭐⭐⭐ Masterpiece!', votes: 0 },
          { text: '⭐⭐⭐⭐ Sangat Bagus', votes: 0 },
          { text: '⭐⭐⭐ Cukup Bagus', votes: 0 },
          { text: '⭐⭐ Biasa Saja', votes: 0 },
          { text: '⭐ Kurang Bagus', votes: 0 }
        ]
      }
    };
    setMessages([...messages, pollMessage]);
  };

  const reportMessage = (reason: string) => {
    if (reportingMessage) {
      const reportMsg: Message = {
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        userAvatar: '',
        content: `Laporan telah dikirim. Terima kasih atas laporan Anda.`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages([...messages, reportMsg]);
      setShowReportModal(false);
      setReportingMessage(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: React.ReactNode }> = {
      admin: { color: 'bg-red-500', icon: '👑' },
      moderator: { color: 'bg-blue-500', icon: '🛡️' },
      vip: { color: 'bg-yellow-500', icon: '⭐' },
      member: { color: 'bg-gray-500', icon: null }
    };
    return badges[role] || badges.member;
  };

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[500px]'} bg-dark-400 rounded-2xl shadow-2xl border border-dark-100 flex flex-col z-50 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-100 bg-gradient-to-r from-primary-500/20 to-violet-500/20 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-primary-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-400"></span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{roomName}</h3>
            <p className="text-xs text-secondary-400">{onlineUsers.length} online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowUserList(!showUserList)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5 text-secondary-400" />
          </button>
          {isWatchParty && (
            <>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-secondary-400" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-secondary-400" />
              </button>
            </>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? <Minimize className="w-5 h-5 text-secondary-400" /> : <Maximize className="w-5 h-5 text-secondary-400" />}
          </button>
        </div>
      </div>

      {/* User List Sidebar */}
      {showUserList && (
        <div className="absolute top-16 right-0 w-64 bg-dark-300 rounded-lg shadow-xl border border-dark-100 p-4 z-10">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Pengguna Online
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-200 transition-colors">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-300"></span>
                </div>
                <span className="text-white text-sm flex-1">{user.name}</span>
                {getRoleBadge(user.role).icon && (
                  <span className="text-sm">{getRoleBadge(user.role).icon}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`${message.type === 'system' ? 'text-center' : ''}`}>
            {message.type === 'system' ? (
              <div className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-sm text-primary-300">
                {message.content}
              </div>
            ) : message.type === 'poll' && message.pollData ? (
              <div className="bg-dark-300 rounded-xl p-4">
                <p className="font-bold text-white mb-3">📊 {message.pollData.question}</p>
                <div className="space-y-2">
                  {message.pollData.options.map((option, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-3 bg-dark-200 hover:bg-dark-100 rounded-lg transition-colors text-sm text-white"
                    >
                      {option.text}
                      <span className="float-right text-secondary-400">{option.votes} votes</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`flex gap-3 ${message.userId === 'me' ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={message.userAvatar} 
                  alt={message.userName}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
                <div className={`flex-1 ${message.userId === 'me' ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {message.userId !== 'me' && (
                      <span className="text-sm font-medium text-primary-400">{message.userName}</span>
                    )}
                    <span className="text-xs text-secondary-500">
                      {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {message.replyTo && (
                    <div className="text-xs text-secondary-400 bg-dark-300/50 p-2 rounded-lg mb-1 border-l-2 border-primary-500">
                      <span className="text-primary-400">@{message.replyTo.userName}</span>: {message.replyTo.content.slice(0, 50)}...
                    </div>
                  )}
                  
                  <div className={`inline-block px-4 py-2 rounded-2xl ${message.userId === 'me' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-white'}`}>
                    {message.content}
                  </div>
                  
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {message.reactions.map((reaction, idx) => (
                        <button 
                          key={idx}
                          onClick={() => addReaction(message.id, reaction.emoji)}
                          className="px-2 py-0.5 bg-dark-300 rounded-full text-xs hover:bg-dark-200 transition-colors"
                        >
                          {reaction.emoji} {reaction.count}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Message Actions */}
                  {message.userId !== 'me' && (message.type as MessageType) !== 'system' && (
                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setReplyingTo(message)}
                        className="p-1 hover:bg-dark-300 rounded text-secondary-400 hover:text-white"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => { setReportingMessage(message); setShowReportModal(true); }}
                        className="p-1 hover:bg-dark-300 rounded text-secondary-400 hover:text-red-400"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-dark-300 border-t border-dark-100 flex items-center justify-between">
          <div className="text-xs text-secondary-400">
            Membalas <span className="text-primary-400">@{replyingTo.userName}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-secondary-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-dark-300 border-t border-dark-100">
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setNewMessage(prev => prev + emoji)}
                className="text-xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-dark-100">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-dark-300 rounded-lg transition-colors text-secondary-400 hover:text-yellow-400"
          >
            <Smile className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-dark-300 rounded-lg transition-colors text-secondary-400 hover:text-primary-400">
            <Image className="w-5 h-5" />
          </button>
          <button 
            onClick={createPoll}
            className="p-2 hover:bg-dark-300 rounded-lg transition-colors text-secondary-400 hover:text-violet-400"
            title="Buat Poll"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ketik pesan..."
            className="flex-1 bg-dark-300 border border-dark-100 rounded-xl px-4 py-2 text-white placeholder:text-secondary-500 focus:outline-none focus:border-primary-500"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
          <div className="bg-dark-300 rounded-xl p-6 w-80">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-400" /> Laporkan Pesan
            </h4>
            <div className="space-y-2">
              {['Spam', 'Konten tidak pantas', 'Pelecehan', 'Informasi palsu', 'Lainnya'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => reportMessage(reason)}
                  className="w-full text-left p-3 bg-dark-200 hover:bg-dark-100 rounded-lg transition-colors text-white text-sm"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full mt-4 p-2 bg-dark-200 hover:bg-dark-100 rounded-lg transition-colors text-secondary-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
