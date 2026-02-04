// Custom Icons Collection - ASTRO Movie Review
import { 
  Film, Play, Star, Heart, Bookmark, Search, Menu, X, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, User, Settings, LogOut, Bell, Home, TrendingUp, Calendar,
  Clock, Eye, MessageCircle, Share2, Download, Printer, Filter, Grid, List, 
  MoreVertical, Edit, Trash2, Flag, Send, Smile, Paperclip, Image, Video,
  Users, UserPlus, Crown, Shield, Zap, Award, Target, Sparkles, Flame, Tv,
  Clapperboard, Popcorn, Ticket, Globe, Moon, Sun, Volume2, VolumeX, Maximize,
  Minimize, SkipBack, SkipForward, Pause, PlayCircle, StopCircle, Radio,
  Wifi, Cast, Monitor, Smartphone, Headphones, Mic, MicOff, Camera, CameraOff,
  PhoneCall, PhoneOff, AlertCircle, Info, CheckCircle, XCircle, HelpCircle,
  RefreshCw, ExternalLink, Copy, Link, QrCode, BarChart3, PieChart, Activity,
  FileText, File, Folder, Archive, Upload, CloudDownload
} from 'lucide-react';

// Re-export all icons
export {
  Film, Play, Star, Heart, Bookmark, Search, Menu, X, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, User, Settings, LogOut, Bell, Home, TrendingUp, Calendar,
  Clock, Eye, MessageCircle, Share2, Download, Printer, Filter, Grid, List, 
  MoreVertical, Edit, Trash2, Flag, Send, Smile, Paperclip, Image, Video,
  Users, UserPlus, Crown, Shield, Zap, Award, Target, Sparkles, Flame, Tv,
  Clapperboard, Popcorn, Ticket, Globe, Moon, Sun, Volume2, VolumeX, Maximize,
  Minimize, SkipBack, SkipForward, Pause, PlayCircle, StopCircle, Radio,
  Wifi, Cast, Monitor, Smartphone, Headphones, Mic, MicOff, Camera, CameraOff,
  PhoneCall, PhoneOff, AlertCircle, Info, CheckCircle, XCircle, HelpCircle,
  RefreshCw, ExternalLink, Copy, Link, QrCode, BarChart3, PieChart, Activity,
  FileText, File, Folder, Archive, Upload, CloudDownload
};

// Custom animated icons
export const AnimatedStar = ({ className = "", filled = false }: { className?: string; filled?: boolean }) => (
  <Star 
    className={`transition-all duration-300 hover:scale-125 ${filled ? 'fill-yellow-400 text-yellow-400' : ''} ${className}`} 
  />
);

export const AnimatedHeart = ({ className = "", filled = false }: { className?: string; filled?: boolean }) => (
  <Heart 
    className={`transition-all duration-300 hover:scale-125 ${filled ? 'fill-red-500 text-red-500' : ''} ${className}`} 
  />
);

export const PulseIcon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`relative inline-flex ${className}`}>
    {children}
    <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20"></span>
  </span>
);

// Logo Icon
export const AstroLogo = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A2DE7" />
        <stop offset="100%" stopColor="#8F29BC" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#logoGrad)"/>
    <text x="50" y="67" fontFamily="Arial, sans-serif" fontSize="45" fontWeight="bold" fill="white" textAnchor="middle">A</text>
    <circle cx="75" cy="25" r="8" fill="#F062C8"/>
    <circle cx="75" cy="25" r="4" fill="white">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

// Cinema Icons
export const Cinema3D = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 8h20M6 8v12M18 8v12"/>
    <circle cx="12" cy="14" r="3"/>
  </svg>
);

export const FilmReel = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
    <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);
