import { useState, useRef, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title?: string;
  posterUrl?: string;
  isSynced?: boolean;
  isHost?: boolean;
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  syncTime?: number;
}

export function VideoPlayer({ 
  url, 
  title,
  posterUrl,
  isSynced = false,
  isHost = false,
  onTimeUpdate,
  onPlay,
  onPause,
  onSeek,
  syncTime
}: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffering, setBuffering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync playback time from host
  useEffect(() => {
    if (!isHost && syncTime !== undefined && playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      // Only sync if difference is more than 2 seconds
      if (Math.abs(currentTime - syncTime) > 2) {
        playerRef.current.seekTo(syncTime);
      }
    }
  }, [syncTime, isHost]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.playedSeconds);
    onTimeUpdate?.(state.playedSeconds);
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const handlePlay = () => {
    setPlaying(true);
    onPlay?.();
  };

  const handlePause = () => {
    setPlaying(false);
    onPause?.();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    playerRef.current?.seekTo(time);
    onSeek?.(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setMuted(vol === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const skip = (seconds: number) => {
    if (playerRef.current) {
      const newTime = playerRef.current.getCurrentTime() + seconds;
      playerRef.current.seekTo(newTime);
      onSeek?.(newTime);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onBuffer={() => setBuffering(true)}
        onBufferEnd={() => setBuffering(false)}
        config={{
          youtube: {
            playerVars: { modestbranding: 1 }
          }
        }}
      />

      {/* Poster overlay when not playing */}
      {!playing && posterUrl && (
        <div className="absolute inset-0">
          <img src={posterUrl} alt={title} className="w-full h-full object-cover opacity-40" />
        </div>
      )}

      {/* Buffering indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Play button overlay */}
      {!playing && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="w-20 h-20 bg-violet-500/90 rounded-full flex items-center justify-center hover:bg-violet-500 transition-all hover:scale-110 shadow-lg shadow-violet-500/50"
          >
            <Icon icon="lucide:play" className="w-10 h-10 text-white ml-1" />
          </button>
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          {title && (
            <h3 className="text-white font-medium text-lg truncate">{title}</h3>
          )}
          {isSynced && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full text-green-400 text-sm">
              <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
              <span>Synced</span>
            </div>
          )}
        </div>

        {/* Center controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <button 
            onClick={() => skip(-10)}
            className="p-3 text-white/80 hover:text-white transition-colors"
          >
            <Icon icon="lucide:rewind" className="w-8 h-8" />
          </button>
          <button 
            onClick={() => playing ? handlePause() : handlePlay()}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Icon 
              icon={playing ? "lucide:pause" : "lucide:play"} 
              className={`w-8 h-8 text-white ${!playing && 'ml-1'}`}
            />
          </button>
          <button 
            onClick={() => skip(10)}
            className="p-3 text-white/80 hover:text-white transition-colors"
          >
            <Icon icon="lucide:fast-forward" className="w-8 h-8" />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress bar */}
          <div className="mb-4 group/progress">
            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
                group-hover/progress:[&::-webkit-slider-thumb]:w-4 group-hover/progress:[&::-webkit-slider-thumb]:h-4
                transition-all"
              style={{
                background: `linear-gradient(to right, rgb(139 92 246) ${(progress / duration) * 100}%, rgba(255,255,255,0.3) ${(progress / duration) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => playing ? handlePause() : handlePlay()}
                className="text-white hover:text-violet-400 transition-colors"
              >
                <Icon icon={playing ? "lucide:pause" : "lucide:play"} className="w-6 h-6" />
              </button>
              <button onClick={() => skip(-10)} className="text-white/80 hover:text-white transition-colors">
                <Icon icon="lucide:rewind" className="w-5 h-5" />
              </button>
              <button onClick={() => skip(10)} className="text-white/80 hover:text-white transition-colors">
                <Icon icon="lucide:fast-forward" className="w-5 h-5" />
              </button>
              
              {/* Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                  <Icon 
                    icon={muted || volume === 0 ? "lucide:volume-x" : volume < 0.5 ? "lucide:volume-1" : "lucide:volume-2"} 
                    className="w-5 h-5" 
                  />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/vol:w-20 transition-all duration-200 h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback speed */}
              <div className="relative group/speed">
                <button className="text-white/80 hover:text-white transition-colors text-sm font-medium">
                  {playbackRate}x
                </button>
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/speed:block">
                  <div className="bg-dark-400 rounded-lg p-2 shadow-xl border border-dark-100">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`block w-full px-4 py-1.5 text-sm rounded hover:bg-dark-300 transition-colors ${
                          playbackRate === rate ? 'text-violet-400' : 'text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtitles */}
              <button className="text-white/80 hover:text-white transition-colors">
                <Icon icon="lucide:subtitles" className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button className="text-white/80 hover:text-white transition-colors">
                <Icon icon="lucide:settings" className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
                <Icon icon={fullscreen ? "lucide:minimize" : "lucide:maximize"} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Host indicator */}
      {isHost && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-violet-500 rounded-full text-white text-sm font-medium">
          <Icon icon="lucide:crown" className="w-4 h-4" />
          <span>Host</span>
        </div>
      )}
    </div>
  );
}

// Live Chat Component for Watch Party
interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isHost?: boolean;
  isVtuber?: boolean;
}

interface LiveChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser?: string;
}

export function LiveChat({ messages, onSendMessage, currentUser }: LiveChatProps) {
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-400 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-100">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Icon icon="lucide:message-circle" className="w-5 h-5 text-violet-400" />
          Live Chat
        </h3>
      </div>

      <div 
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent' }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.isHost ? 'bg-violet-500/10 -mx-4 px-4 py-2 rounded-lg' : ''}`}
          >
            <img 
              src={msg.avatar}
              alt={msg.user}
              className={`w-8 h-8 rounded-full flex-shrink-0 ${msg.isVtuber ? 'ring-2 ring-violet-500' : ''}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium text-sm ${msg.isVtuber ? 'text-violet-400' : 'text-white'}`}>
                  {msg.user}
                </span>
                {msg.isHost && (
                  <span className="text-xs bg-violet-500 px-1.5 py-0.5 rounded text-white">HOST</span>
                )}
                {msg.isVtuber && !msg.isHost && (
                  <Icon icon="lucide:check-circle" className="w-3 h-3 text-violet-400" />
                )}
              </div>
              <p className="text-secondary-200 text-sm break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-dark-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white placeholder:text-secondary-500 focus:outline-none focus:border-violet-500"
          />
          <button 
            onClick={handleSend}
            className="px-4 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl transition-colors"
          >
            <Icon icon="lucide:send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Reaction Panel
interface ReactionPanelProps {
  onReaction: (emoji: string) => void;
  reactionCounts?: Record<string, number>;
}

export function ReactionPanel({ onReaction, reactionCounts = {} }: ReactionPanelProps) {
  const reactions = ['❤️', '🔥', '😂', '😱', '😢', '👏', '🎉', '💯'];

  return (
    <div className="bg-dark-400 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-secondary-400 text-sm mr-2">Reaksi:</span>
          {reactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReaction(emoji)}
              className="p-2 hover:bg-dark-300 rounded-lg transition-colors text-xl hover:scale-125 duration-200"
            >
              {emoji}
            </button>
          ))}
        </div>
        {Object.keys(reactionCounts).length > 0 && (
          <div className="flex items-center gap-3 text-secondary-400 text-sm">
            {Object.entries(reactionCounts).slice(0, 3).map(([emoji, count]) => (
              <span key={emoji}>{emoji} {count}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Participant List
interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isVtuber?: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
  hostId?: string;
}

export function ParticipantList({ participants, hostId }: ParticipantListProps) {
  return (
    <div className="bg-dark-400 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-100">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Icon icon="lucide:users" className="w-5 h-5 text-violet-400" />
          Peserta ({participants.length})
        </h3>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto space-y-3">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={p.avatar} 
                alt={p.name}
                className={`w-10 h-10 rounded-full ${p.isVtuber ? 'ring-2 ring-violet-500' : ''}`}
              />
              {p.id === hostId && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                  <Icon icon="lucide:crown" className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${p.isVtuber ? 'text-violet-400' : 'text-white'}`}>
                {p.name}
              </p>
              {p.isHost && <p className="text-xs text-violet-300">Host</p>}
            </div>
            {p.isVtuber && <Icon icon="lucide:check-circle" className="w-4 h-4 text-violet-400" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoPlayer;
