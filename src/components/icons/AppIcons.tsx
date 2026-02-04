// Centralized Icon Component using Iconify
import { Icon } from '@iconify/react';
import type { CSSProperties } from 'react';

interface IconProps {
  icon: string;
  className?: string;
  size?: number | string;
  color?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

// Main Icon component using Iconify
export const AppIcon = ({ icon, className = '', size = 24, color, style, onClick }: IconProps) => (
  <Icon 
    icon={icon} 
    className={className}
    width={size} 
    height={size}
    color={color}
    style={style}
    onClick={onClick}
  />
);

// Predefined icon mappings for easy use
export const Icons = {
  // Navigation
  home: 'lucide:home',
  compass: 'lucide:compass',
  search: 'lucide:search',
  menu: 'lucide:menu',
  close: 'lucide:x',
  chevronLeft: 'lucide:chevron-left',
  chevronRight: 'lucide:chevron-right',
  chevronDown: 'lucide:chevron-down',
  chevronUp: 'lucide:chevron-up',
  arrowLeft: 'lucide:arrow-left',
  arrowRight: 'lucide:arrow-right',
  externalLink: 'lucide:external-link',
  
  // Media
  film: 'lucide:film',
  clapperboard: 'lucide:clapperboard',
  tv: 'lucide:tv',
  play: 'lucide:play',
  pause: 'lucide:pause',
  playCircle: 'lucide:play-circle',
  video: 'lucide:video',
  videoOff: 'lucide:video-off',
  volume2: 'lucide:volume-2',
  volumeX: 'lucide:volume-x',
  maximize: 'lucide:maximize',
  minimize: 'lucide:minimize',
  skipBack: 'lucide:skip-back',
  skipForward: 'lucide:skip-forward',
  
  // Categories
  anime: 'mdi:anime',
  sparkles: 'lucide:sparkles',
  flame: 'lucide:flame',
  trending: 'lucide:trending-up',
  calendar: 'lucide:calendar',
  clock: 'lucide:clock',
  star: 'lucide:star',
  starFilled: 'ph:star-fill',
  heart: 'lucide:heart',
  heartFilled: 'ph:heart-fill',
  
  // User
  user: 'lucide:user',
  users: 'lucide:users',
  userPlus: 'lucide:user-plus',
  userCheck: 'lucide:user-check',
  crown: 'lucide:crown',
  shield: 'lucide:shield',
  settings: 'lucide:settings',
  logout: 'lucide:log-out',
  login: 'lucide:log-in',
  
  // Social/Actions
  bookmark: 'lucide:bookmark',
  bookmarkFilled: 'ph:bookmark-fill',
  share: 'lucide:share-2',
  download: 'lucide:download',
  upload: 'lucide:upload',
  edit: 'lucide:edit',
  trash: 'lucide:trash-2',
  flag: 'lucide:flag',
  send: 'lucide:send',
  link: 'lucide:link',
  copy: 'lucide:copy',
  
  // Communication
  message: 'lucide:message-circle',
  bell: 'lucide:bell',
  bellOff: 'lucide:bell-off',
  mic: 'lucide:mic',
  micOff: 'lucide:mic-off',
  camera: 'lucide:camera',
  cameraOff: 'lucide:camera-off',
  phone: 'lucide:phone',
  phoneOff: 'lucide:phone-off',
  
  // Status
  check: 'lucide:check',
  checkCircle: 'lucide:check-circle',
  xCircle: 'lucide:x-circle',
  alertCircle: 'lucide:alert-circle',
  info: 'lucide:info',
  helpCircle: 'lucide:help-circle',
  loader: 'lucide:loader-2',
  refresh: 'lucide:refresh-cw',
  
  // Layout
  grid: 'lucide:grid',
  list: 'lucide:list',
  moreVertical: 'lucide:more-vertical',
  moreHorizontal: 'lucide:more-horizontal',
  filter: 'lucide:filter',
  sort: 'lucide:arrow-up-down',
  
  // Charts/Data
  barChart: 'lucide:bar-chart-3',
  pieChart: 'lucide:pie-chart',
  activity: 'lucide:activity',
  eye: 'lucide:eye',
  eyeOff: 'lucide:eye-off',
  
  // VTuber specific
  vtuber: 'mdi:account-star',
  live: 'lucide:radio',
  stream: 'lucide:cast',
  debut: 'mdi:star-shooting',
  followers: 'lucide:users',
  broadcast: 'mdi:broadcast',
  
  // Misc
  ticket: 'lucide:ticket',
  popcorn: 'mdi:popcorn',
  cinema: 'mdi:filmstrip',
  globe: 'lucide:globe',
  moon: 'lucide:moon',
  sun: 'lucide:sun',
  zap: 'lucide:zap',
  award: 'lucide:award',
  target: 'lucide:target',
  folder: 'lucide:folder',
  file: 'lucide:file',
  image: 'lucide:image',
  headphones: 'lucide:headphones',
  monitor: 'lucide:monitor',
  smartphone: 'lucide:smartphone',
  wifi: 'lucide:wifi',
  
  // Social Media
  youtube: 'mdi:youtube',
  twitter: 'mdi:twitter',
  instagram: 'mdi:instagram',
  twitch: 'mdi:twitch',
  discord: 'mdi:discord',
  tiktok: 'mdi:music-note',
};

// Quick icon components for common use
export const HomeIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.home} className={className} size={size} />;
export const SearchIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.search} className={className} size={size} />;
export const FilmIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.film} className={className} size={size} />;
export const TvIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.tv} className={className} size={size} />;
export const AnimeIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.anime} className={className} size={size} />;
export const StarIcon = ({ className = '', size = 24, filled = false }) => (
  <AppIcon icon={filled ? Icons.starFilled : Icons.star} className={className} size={size} />
);
export const HeartIcon = ({ className = '', size = 24, filled = false }) => (
  <AppIcon icon={filled ? Icons.heartFilled : Icons.heart} className={className} size={size} />
);
export const PlayIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.play} className={className} size={size} />;
export const BellIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.bell} className={className} size={size} />;
export const UserIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.user} className={className} size={size} />;
export const SettingsIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.settings} className={className} size={size} />;
export const MenuIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.menu} className={className} size={size} />;
export const CloseIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.close} className={className} size={size} />;
export const LoaderIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.loader} className={`animate-spin ${className}`} size={size} />;
export const VTuberIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.vtuber} className={className} size={size} />;
export const LiveIcon = ({ className = '', size = 24 }) => <AppIcon icon={Icons.live} className={className} size={size} />;

// Category badges with icons
interface CategoryBadgeProps {
  category: 'movie' | 'anime' | 'series' | 'cinema' | 'upcoming' | 'trending' | 'toprated' | 'vtuber';
  className?: string;
}

export const CategoryBadge = ({ category, className = '' }: CategoryBadgeProps) => {
  const config: Record<string, { icon: string; label: string; color: string }> = {
    movie: { icon: Icons.film, label: 'Semua Film', color: 'bg-gradient-to-r from-primary-500 to-violet-500' },
    anime: { icon: Icons.anime, label: 'Anime', color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    series: { icon: Icons.tv, label: 'Series', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    cinema: { icon: Icons.clapperboard, label: 'Bioskop', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    upcoming: { icon: Icons.calendar, label: 'Akan Datang', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    trending: { icon: Icons.flame, label: 'Trending', color: 'bg-gradient-to-r from-red-500 to-orange-500' },
    toprated: { icon: Icons.star, label: 'Top Rated', color: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
    vtuber: { icon: Icons.vtuber, label: 'VTuber', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  };
  
  const { icon, label, color } = config[category] || config.movie;
  
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 ${color} text-white rounded-full font-medium ${className}`}>
      <AppIcon icon={icon} size={18} />
      {label}
    </span>
  );
};

export default AppIcon;
