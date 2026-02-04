import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings,
  SkipBack, SkipForward, Users, MessageCircle, Share2, Cast,
  Monitor, Crown, Clock, Film, Popcorn, ChevronDown
} from 'lucide-react';

interface WatchPartyProps {
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  hostName?: string;
}

export default function WatchParty({ movieId, movieTitle, moviePoster, hostName = "Host" }: WatchPartyProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(7200); // 2 hours in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'CinemaLover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CinemaLover', isHost: true },
    { id: '2', name: 'MovieBuff', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff', isHost: false },
    { id: '3', name: 'FilmCritic', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FilmCritic', isHost: false },
    { id: '4', name: 'PopcornFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PopcornFan', isHost: false },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setCurrentTime(Math.floor(percent * duration));
    }
  };

  const addReaction = (emoji: string) => {
    const id = Date.now().toString();
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 60 + 20;
    setReactions(prev => [...prev, { id, emoji, x, y }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://astro-review.id/watch-party/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Header */}
      <div className="bg-dark-400 border-b border-dark-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Popcorn className="w-8 h-8 text-primary-400" />
              <span className="font-display font-bold text-xl text-white">Nonton Bareng</span>
            </div>
            <div className="h-6 w-px bg-dark-100"></div>
            <div>
              <h1 className="font-bold text-white">{movieTitle}</h1>
              <p className="text-sm text-secondary-400 flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-400" /> Host: {hostName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Participants */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {participants.slice(0, 4).map((p) => (
                  <img 
                    key={p.id}
                    src={p.avatar} 
                    alt={p.name}
                    className="w-8 h-8 rounded-full border-2 border-dark-400"
                    title={p.name}
                  />
                ))}
              </div>
              {participants.length > 4 && (
                <span className="text-secondary-400 text-sm">+{participants.length - 4}</span>
              )}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="ml-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Undang
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Video Player */}
        <div className={`flex-1 p-4 ${showChat ? '' : ''}`}>
          <div 
            ref={videoContainerRef}
            className="relative bg-black rounded-2xl overflow-hidden aspect-video group"
          >
            {/* Video Placeholder / Poster */}
            <img 
              src={`https://image.tmdb.org/t/p/original${moviePoster}`}
              alt={movieTitle}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-500 rounded text-white text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> LIVE
                  </span>
                  <span className="text-white text-sm">{participants.length} menonton</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <Cast className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Center Play Button */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-500/80 hover:bg-primary-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </button>

              {/* Floating Reactions */}
              {reactions.map((r) => (
                <span 
                  key={r.id}
                  className="absolute text-4xl animate-float-up pointer-events-none"
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                >
                  {r.emoji}
                </span>
              ))}

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div 
                  ref={progressRef}
                  onClick={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 group/progress"
                >
                  <div 
                    className="h-full bg-primary-500 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button className="text-white hover:text-primary-400 transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button className="text-white hover:text-primary-400 transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    
                    {/* Volume */}
                    <div className="flex items-center gap-2 group/volume">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:text-primary-400 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quick Reactions */}
                    <div className="flex items-center gap-1">
                      {['❤️', '😂', '😱', '👏', '🔥'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(emoji)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => setShowChat(!showChat)}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={toggleFullscreen}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Indicator */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/80 rounded-full text-white text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Tersinkronisasi
            </div>
          </div>

          {/* Movie Info */}
          <div className="mt-4 p-4 bg-dark-400 rounded-xl border border-dark-100">
            <h2 className="text-xl font-bold text-white mb-2">{movieTitle}</h2>
            <div className="flex items-center gap-4 text-sm text-secondary-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 2j 15m</span>
              <span className="flex items-center gap-1"><Film className="w-4 h-4" /> Action, Adventure</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {participants.length} menonton</span>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-96 border-l border-dark-100">
            {/* Chat content will be handled by LiveChat component */}
            <div className="h-[calc(100vh-80px)] flex flex-col">
              <div className="p-4 border-b border-dark-100 bg-dark-400">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary-400" /> Live Chat
                </h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-center text-secondary-400 text-sm">
                  Chat aktif saat nonton bareng!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowInviteModal(false)}>
          <div className="bg-dark-400 rounded-2xl p-6 w-96 max-w-[90vw]" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary-400" /> Undang Teman
            </h3>
            
            <div className="bg-dark-300 rounded-xl p-4 mb-4">
              <p className="text-sm text-secondary-400 mb-2">Link Undangan:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`https://astro-review.id/watch-party/${movieId}`}
                  readOnly
                  className="flex-1 bg-dark-200 px-3 py-2 rounded-lg text-white text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white text-sm transition-colors"
                >
                  Salin
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 p-3 bg-[#25D366] hover:opacity-90 rounded-xl text-white text-sm font-medium transition-opacity">
                WhatsApp
              </button>
              <button className="flex-1 p-3 bg-[#1DA1F2] hover:opacity-90 rounded-xl text-white text-sm font-medium transition-opacity">
                Twitter
              </button>
              <button className="flex-1 p-3 bg-[#4267B2] hover:opacity-90 rounded-xl text-white text-sm font-medium transition-opacity">
                Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
