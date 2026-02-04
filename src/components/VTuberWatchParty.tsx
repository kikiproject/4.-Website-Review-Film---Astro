// VTuber Watch Party Component
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppIcon, Icons } from './icons/AppIcons';

interface VTuber {
  id: number;
  username: string;
  displayName: string;
  vtuberName: string;
  vtuberAvatar: string | null;
  vtuberAgency: string | null;
  vtuberIsLive: boolean;
  vtuberFollowersCount: number;
}

interface WatchPartyRoom {
  id: string;
  title: string;
  movieTitle: string;
  moviePoster: string;
  host: VTuber;
  participants: number;
  maxParticipants: number;
  scheduledAt: Date;
  status: 'scheduled' | 'live' | 'ended';
  isVtuberEvent: boolean;
  videoUrl?: string;
}

interface Message {
  id: string;
  user: { name: string; avatar: string; isVtuber: boolean };
  content: string;
  type: 'text' | 'reaction' | 'system';
  timestamp: Date;
}

// VTuber Card Component
export function VTuberCard({ vtuber, onFollow }: { vtuber: VTuber; onFollow?: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative bg-dark-400/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-dark-100 hover:border-violet-500/50 transition-all group"
    >
      {/* VTuber banner */}
      <div className="relative h-32 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-20" />
        
        {/* Live badge */}
        {vtuber.vtuberIsLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full text-white text-sm font-bold animate-pulse">
            <AppIcon icon={Icons.live} size={14} />
            LIVE
          </div>
        )}
        
        {/* Agency badge */}
        {vtuber.vtuberAgency && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-white/80 text-xs">
            {vtuber.vtuberAgency}
          </div>
        )}
      </div>
      
      {/* Avatar */}
      <div className="relative -mt-12 px-4">
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-pink-500 p-1">
            <img
              src={vtuber.vtuberAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(vtuber.vtuberName)}&background=8B5CF6&color=fff&size=96`}
              alt={vtuber.vtuberName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-500 rounded-full flex items-center justify-center border-2 border-dark-400">
            <AppIcon icon={Icons.checkCircle} size={16} className="text-white" />
          </div>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          {vtuber.vtuberName}
          <AppIcon icon={Icons.vtuber} size={18} className="text-violet-400" />
        </h3>
        <p className="text-secondary-400 text-sm">@{vtuber.username}</p>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1 text-secondary-300">
            <AppIcon icon={Icons.users} size={16} />
            <span>{vtuber.vtuberFollowersCount.toLocaleString()}</span>
          </div>
        </div>
        
        <button
          onClick={onFollow}
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-glow-violet transition-all flex items-center justify-center gap-2"
        >
          <AppIcon icon={Icons.userPlus} size={18} />
          Ikuti
        </button>
      </div>
    </motion.div>
  );
}

// Watch Party Room Card
export function WatchPartyCard({ room, onJoin }: { room: WatchPartyRoom; onJoin?: () => void }) {
  const isLive = room.status === 'live';
  const isScheduled = room.status === 'scheduled';
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative bg-dark-400 rounded-2xl overflow-hidden border border-dark-100 hover:border-primary-500/50 transition-all group"
    >
      {/* Movie poster with overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={room.moviePoster}
          alt={room.movieTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/50 to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full text-white text-sm font-bold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          ) : isScheduled ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 rounded-full text-white text-sm font-medium">
              <AppIcon icon={Icons.calendar} size={14} />
              {new Date(room.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
          ) : null}
        </div>
        
        {/* VTuber event badge */}
        {room.isVtuberEvent && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-violet-500 rounded-full text-white text-sm font-medium">
            <AppIcon icon={Icons.vtuber} size={14} />
            VTuber
          </div>
        )}
        
        {/* Participants count */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
          <AppIcon icon={Icons.users} size={14} />
          {room.participants}/{room.maxParticipants}
        </div>
        
        {/* Play button overlay */}
        {isLive && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-glow"
            >
              <AppIcon icon={Icons.play} size={32} className="ml-1" />
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-4">
        <p className="text-secondary-400 text-sm mb-1">{room.movieTitle}</p>
        <h3 className="text-white font-bold text-lg mb-3 line-clamp-1">{room.title}</h3>
        
        {/* Host info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={room.host.vtuberAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.host.vtuberName)}&background=8B5CF6&color=fff`}
              alt={room.host.vtuberName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500"
            />
            <div>
              <p className="text-white text-sm font-medium flex items-center gap-1">
                {room.host.vtuberName}
                {room.isVtuberEvent && <AppIcon icon={Icons.checkCircle} size={14} className="text-violet-400" />}
              </p>
              <p className="text-secondary-500 text-xs">Host</p>
            </div>
          </div>
          
          <button
            onClick={onJoin}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              isLive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-dark-200 text-white hover:bg-dark-100'
            }`}
          >
            <AppIcon icon={isLive ? Icons.play : Icons.calendar} size={16} />
            {isLive ? 'Gabung' : 'Reminder'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Live Watch Room Component
export function LiveWatchRoom({ room }: { room: WatchPartyRoom }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      { id: '1', user: { name: 'Sakura Hana', avatar: '', isVtuber: true }, content: 'Selamat datang semuanya! 🎉', type: 'text', timestamp: new Date() },
      { id: '2', user: { name: 'User123', avatar: '', isVtuber: false }, content: 'Wooo excited banget!', type: 'text', timestamp: new Date() },
      { id: '3', user: { name: 'MovieFan', avatar: '', isVtuber: false }, content: 'Film favorit nih!', type: 'text', timestamp: new Date() },
    ];
    setMessages(mockMessages);
  }, []);
  
  // Auto scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      user: { name: 'You', avatar: '', isVtuber: false },
      content: newMessage,
      type: 'text',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };
  
  const reactions = ['❤️', '😂', '😮', '👏', '🔥', '💯'];
  
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-dark-500">
      {/* Video Player Section */}
      <div className={`flex-1 relative ${isChatOpen ? 'lg:mr-80' : ''} transition-all`}>
        {/* Video player placeholder */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={room.moviePoster}
              alt={room.movieTitle}
              className="w-full h-full object-contain opacity-50"
            />
          </div>
          
          {/* Video controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <AppIcon icon={isPlaying ? Icons.pause : Icons.play} size={24} className="text-white" />
              </button>
              
              {/* Progress bar */}
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div className="w-1/3 h-full bg-primary-500" />
              </div>
              
              <span className="text-white text-sm">1:23:45 / 2:30:00</span>
              
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <AppIcon icon={Icons.volume2} size={20} className="text-white" />
              </button>
              
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <AppIcon icon={Icons.maximize} size={20} className="text-white" />
              </button>
            </div>
          </div>
          
          {/* Sync indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Tersinkronisasi
          </div>
          
          {/* Participants indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            <AppIcon icon={Icons.users} size={16} />
            {room.participants} menonton
          </div>
        </div>
        
        {/* Quick reactions bar */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-dark-400/90 backdrop-blur-sm rounded-full">
          {reactions.map((emoji, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-2xl hover:bg-white/10 rounded-full p-1 transition-colors"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        
        {/* Toggle chat button (mobile/tablet) */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="lg:hidden absolute bottom-4 right-4 p-3 bg-primary-500 rounded-full text-white shadow-glow"
        >
          <AppIcon icon={Icons.message} size={24} />
        </button>
      </div>
      
      {/* Chat Sidebar */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            className="fixed lg:relative right-0 top-0 lg:top-auto w-80 h-full bg-dark-400 border-l border-dark-100 flex flex-col z-50"
          >
            {/* Chat header */}
            <div className="p-4 border-b border-dark-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AppIcon icon={Icons.message} size={20} className="text-primary-400" />
                <span className="font-medium text-white">Live Chat</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="lg:hidden p-1 hover:bg-dark-300 rounded"
              >
                <AppIcon icon={Icons.close} size={20} className="text-secondary-400" />
              </button>
            </div>
            
            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <img
                    src={msg.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user.name)}&background=1A2DE7&color=fff&size=32`}
                    alt={msg.user.name}
                    className={`w-8 h-8 rounded-full flex-shrink-0 ${msg.user.isVtuber ? 'ring-2 ring-violet-500' : ''}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${msg.user.isVtuber ? 'text-violet-400' : 'text-primary-400'}`}>
                        {msg.user.name}
                      </span>
                      {msg.user.isVtuber && (
                        <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] rounded font-medium">
                          VTuber
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-dark-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2 bg-dark-300 border border-dark-100 rounded-xl text-white placeholder:text-secondary-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  <AppIcon icon={Icons.send} size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// VTuber Debut Schedule Component
export function VTuberDebutSchedule({ debuts }: { debuts: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <AppIcon icon={Icons.debut} size={24} className="text-violet-400" />
        Jadwal Debut VTuber
      </h3>
      
      <div className="space-y-3">
        {debuts.map((debut, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-4 bg-dark-400/50 rounded-xl border border-violet-500/20 hover:border-violet-500/50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center">
              <AppIcon icon={Icons.vtuber} size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{debut.name}</h4>
              <p className="text-secondary-400 text-sm">{debut.agency}</p>
            </div>
            <div className="text-right">
              <p className="text-violet-400 font-medium">{debut.date}</p>
              <p className="text-secondary-500 text-sm">{debut.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default { VTuberCard, WatchPartyCard, LiveWatchRoom, VTuberDebutSchedule };
