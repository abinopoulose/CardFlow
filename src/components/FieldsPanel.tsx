import React, { useRef, useState } from 'react';
import { Type, Image as ImageIcon, QrCode, Square, Minus, Palette, ImagePlus, PenTool, Barcode } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';
import CropModal from './CropModal';

interface FieldsPanelProps {
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
}

export const CUSTOM_SHAPES = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'star', label: 'Star' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'pentagon', label: 'Pentagon' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'line', label: 'Line' },
  { value: 'ellipse', label: 'Ellipse' },
  { value: 'cross', label: 'Cross' },
  { value: 'heart', label: 'Heart' },
  { value: 'arrow-right', label: 'Arrow Right' },
  { value: 'arrow-left', label: 'Arrow Left' },
  { value: 'arrow-up', label: 'Arrow Up' },
  { value: 'arrow-down', label: 'Arrow Down' },
  { value: 'shield', label: 'Shield' },
  { value: 'tag', label: 'Tag' },
  { value: 'message', label: 'Message' },
  { value: 'moon', label: 'Moon' },
  { value: 'parallelogram', label: 'Parallelogram' },
  { value: 'trapezoid', label: 'Trapezoid' },
  { value: 'octagon', label: 'Octagon' },
  { value: 'heptagon', label: 'Heptagon' },
  { value: 'nonagon', label: 'Nonagon' },
  { value: 'decagon', label: 'Decagon' },
  { value: 'dodecagon', label: 'Dodecagon' },
  { value: 'bookmark', label: 'Bookmark' },
  { value: 'flag', label: 'Flag' },
  { value: 'chevron-up', label: 'Chevron Up' },
  { value: 'chevron-down', label: 'Chevron Down' },
  { value: 'chevron-left', label: 'Chevron Left' },
  { value: 'chevron-right', label: 'Chevron Right' },
  { value: 'plus', label: 'Plus' },
  { value: 'minus', label: 'Minus' },
  { value: 'times', label: 'Times' },
  { value: 'divide', label: 'Divide' },
  { value: 'equals', label: 'Equals' },
  { value: 'home', label: 'Home' },
  { value: 'mail', label: 'Mail' },
  { value: 'user', label: 'User' },
  { value: 'lock', label: 'Lock' },
  { value: 'unlock', label: 'Unlock' },
  { value: 'search', label: 'Search' },
  { value: 'bell', label: 'Bell' },
  { value: 'camera', label: 'Camera' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'music', label: 'Music' },
  { value: 'sun', label: 'Sun' },
  { value: 'zap', label: 'Zap' },
  { value: 'leaf', label: 'Leaf' },
  // 200+ Lucide Shapes
  { value: 'lucide-Activity', label: 'Activity' },
  { value: 'lucide-Airplane', label: 'Airplane' },
  { value: 'lucide-AlarmClock', label: 'Alarm Clock' },
  { value: 'lucide-AlertCircle', label: 'Alert Circle' },
  { value: 'lucide-AlertTriangle', label: 'Alert Triangle' },
  { value: 'lucide-AlignCenter', label: 'Align Center' },
  { value: 'lucide-AlignJustify', label: 'Align Justify' },
  { value: 'lucide-AlignLeft', label: 'Align Left' },
  { value: 'lucide-AlignRight', label: 'Align Right' },
  { value: 'lucide-Anchor', label: 'Anchor' },
  { value: 'lucide-Aperture', label: 'Aperture' },
  { value: 'lucide-Archive', label: 'Archive' },
  { value: 'lucide-ArrowDown', label: 'Arrow Down' },
  { value: 'lucide-ArrowDownCircle', label: 'Arrow Down Circle' },
  { value: 'lucide-ArrowLeft', label: 'Arrow Left' },
  { value: 'lucide-ArrowLeftCircle', label: 'Arrow Left Circle' },
  { value: 'lucide-ArrowRight', label: 'Arrow Right' },
  { value: 'lucide-ArrowRightCircle', label: 'Arrow Right Circle' },
  { value: 'lucide-ArrowUp', label: 'Arrow Up' },
  { value: 'lucide-ArrowUpCircle', label: 'Arrow Up Circle' },
  { value: 'lucide-AtSign', label: 'At Sign' },
  { value: 'lucide-Award', label: 'Award' },
  { value: 'lucide-Banknote', label: 'Banknote' },
  { value: 'lucide-BarChart', label: 'Bar Chart' },
  { value: 'lucide-BarChart2', label: 'Bar Chart 2' },
  { value: 'lucide-Battery', label: 'Battery' },
  { value: 'lucide-BatteryCharging', label: 'Battery Charging' },
  { value: 'lucide-Bell', label: 'Bell' },
  { value: 'lucide-BellOff', label: 'Bell Off' },
  { value: 'lucide-Bluetooth', label: 'Bluetooth' },
  { value: 'lucide-Book', label: 'Book' },
  { value: 'lucide-BookOpen', label: 'Book Open' },
  { value: 'lucide-Bookmark', label: 'Bookmark' },
  { value: 'lucide-Box', label: 'Box' },
  { value: 'lucide-Briefcase', label: 'Briefcase' },
  { value: 'lucide-Building', label: 'Building' },
  { value: 'lucide-Calculator', label: 'Calculator' },
  { value: 'lucide-Calendar', label: 'Calendar' },
  { value: 'lucide-Camera', label: 'Camera' },
  { value: 'lucide-CameraOff', label: 'Camera Off' },
  { value: 'lucide-Car', label: 'Car' },
  { value: 'lucide-Cast', label: 'Cast' },
  { value: 'lucide-Check', label: 'Check' },
  { value: 'lucide-CheckCircle', label: 'Check Circle' },
  { value: 'lucide-CheckSquare', label: 'Check Square' },
  { value: 'lucide-ChevronDown', label: 'Chevron Down' },
  { value: 'lucide-ChevronLeft', label: 'Chevron Left' },
  { value: 'lucide-ChevronRight', label: 'Chevron Right' },
  { value: 'lucide-ChevronUp', label: 'Chevron Up' },
  { value: 'lucide-ChevronsDown', label: 'Chevrons Down' },
  { value: 'lucide-ChevronsLeft', label: 'Chevrons Left' },
  { value: 'lucide-ChevronsRight', label: 'Chevrons Right' },
  { value: 'lucide-ChevronsUp', label: 'Chevrons Up' },
  { value: 'lucide-Circle', label: 'Circle' },
  { value: 'lucide-Clipboard', label: 'Clipboard' },
  { value: 'lucide-Clock', label: 'Clock' },
  { value: 'lucide-Cloud', label: 'Cloud' },
  { value: 'lucide-CloudDrizzle', label: 'Cloud Drizzle' },
  { value: 'lucide-CloudLightning', label: 'Cloud Lightning' },
  { value: 'lucide-CloudRain', label: 'Cloud Rain' },
  { value: 'lucide-CloudSnow', label: 'Cloud Snow' },
  { value: 'lucide-Code', label: 'Code' },
  { value: 'lucide-Coffee', label: 'Coffee' },
  { value: 'lucide-Columns', label: 'Columns' },
  { value: 'lucide-Command', label: 'Command' },
  { value: 'lucide-Compass', label: 'Compass' },
  { value: 'lucide-Copy', label: 'Copy' },
  { value: 'lucide-Cpu', label: 'Cpu' },
  { value: 'lucide-CreditCard', label: 'Credit Card' },
  { value: 'lucide-Crop', label: 'Crop' },
  { value: 'lucide-Crosshair', label: 'Crosshair' },
  { value: 'lucide-Database', label: 'Database' },
  { value: 'lucide-Delete', label: 'Delete' },
  { value: 'lucide-Disc', label: 'Disc' },
  { value: 'lucide-DollarSign', label: 'Dollar Sign' },
  { value: 'lucide-Download', label: 'Download' },
  { value: 'lucide-DownloadCloud', label: 'Download Cloud' },
  { value: 'lucide-Droplet', label: 'Droplet' },
  { value: 'lucide-Edit', label: 'Edit' },
  { value: 'lucide-Edit2', label: 'Edit 2' },
  { value: 'lucide-Edit3', label: 'Edit 3' },
  { value: 'lucide-Eye', label: 'Eye' },
  { value: 'lucide-EyeOff', label: 'Eye Off' },
  { value: 'lucide-FastForward', label: 'Fast Forward' },
  { value: 'lucide-Feather', label: 'Feather' },
  { value: 'lucide-File', label: 'File' },
  { value: 'lucide-FileMinus', label: 'File Minus' },
  { value: 'lucide-FilePlus', label: 'File Plus' },
  { value: 'lucide-FileText', label: 'File Text' },
  { value: 'lucide-Film', label: 'Film' },
  { value: 'lucide-Filter', label: 'Filter' },
  { value: 'lucide-Flag', label: 'Flag' },
  { value: 'lucide-Flame', label: 'Flame' },
  { value: 'lucide-Folder', label: 'Folder' },
  { value: 'lucide-FolderMinus', label: 'Folder Minus' },
  { value: 'lucide-FolderPlus', label: 'Folder Plus' },
  { value: 'lucide-Frown', label: 'Frown' },
  { value: 'lucide-Gift', label: 'Gift' },
  { value: 'lucide-Globe', label: 'Globe' },
  { value: 'lucide-Grid', label: 'Grid' },
  { value: 'lucide-HardDrive', label: 'Hard Drive' },
  { value: 'lucide-Hash', label: 'Hash' },
  { value: 'lucide-Headphones', label: 'Headphones' },
  { value: 'lucide-Heart', label: 'Heart' },
  { value: 'lucide-HelpCircle', label: 'Help Circle' },
  { value: 'lucide-Hexagon', label: 'Hexagon' },
  { value: 'lucide-Home', label: 'Home' },
  { value: 'lucide-Image', label: 'Image' },
  { value: 'lucide-Inbox', label: 'Inbox' },
  { value: 'lucide-Info', label: 'Info' },
  { value: 'lucide-Key', label: 'Key' },
  { value: 'lucide-Layers', label: 'Layers' },
  { value: 'lucide-Layout', label: 'Layout' },
  { value: 'lucide-LifeBuoy', label: 'Life Buoy' },
  { value: 'lucide-Link', label: 'Link' },
  { value: 'lucide-Link2', label: 'Link 2' },
  { value: 'lucide-List', label: 'List' },
  { value: 'lucide-Loader', label: 'Loader' },
  { value: 'lucide-Lock', label: 'Lock' },
  { value: 'lucide-LogIn', label: 'Log In' },
  { value: 'lucide-LogOut', label: 'Log Out' },
  { value: 'lucide-Mail', label: 'Mail' },
  { value: 'lucide-Map', label: 'Map' },
  { value: 'lucide-MapPin', label: 'Map Pin' },
  { value: 'lucide-Maximize', label: 'Maximize' },
  { value: 'lucide-Maximize2', label: 'Maximize 2' },
  { value: 'lucide-Meh', label: 'Meh' },
  { value: 'lucide-Menu', label: 'Menu' },
  { value: 'lucide-MessageCircle', label: 'Message Circle' },
  { value: 'lucide-MessageSquare', label: 'Message Square' },
  { value: 'lucide-Mic', label: 'Mic' },
  { value: 'lucide-MicOff', label: 'Mic Off' },
  { value: 'lucide-Minimize', label: 'Minimize' },
  { value: 'lucide-Minimize2', label: 'Minimize 2' },
  { value: 'lucide-Minus', label: 'Minus' },
  { value: 'lucide-MinusCircle', label: 'Minus Circle' },
  { value: 'lucide-MinusSquare', label: 'Minus Square' },
  { value: 'lucide-Monitor', label: 'Monitor' },
  { value: 'lucide-Moon', label: 'Moon' },
  { value: 'lucide-MoreHorizontal', label: 'More Horizontal' },
  { value: 'lucide-MoreVertical', label: 'More Vertical' },
  { value: 'lucide-MousePointer', label: 'Mouse Pointer' },
  { value: 'lucide-Move', label: 'Move' },
  { value: 'lucide-Music', label: 'Music' },
  { value: 'lucide-Navigation', label: 'Navigation' },
  { value: 'lucide-Navigation2', label: 'Navigation 2' },
  { value: 'lucide-Octagon', label: 'Octagon' },
  { value: 'lucide-Package', label: 'Package' },
  { value: 'lucide-Paperclip', label: 'Paperclip' },
  { value: 'lucide-Pause', label: 'Pause' },
  { value: 'lucide-PauseCircle', label: 'Pause Circle' },
  { value: 'lucide-PenTool', label: 'Pen Tool' },
  { value: 'lucide-Percent', label: 'Percent' },
  { value: 'lucide-Phone', label: 'Phone' },
  { value: 'lucide-PhoneCall', label: 'Phone Call' },
  { value: 'lucide-PhoneForwarded', label: 'Phone Forwarded' },
  { value: 'lucide-PhoneIncoming', label: 'Phone Incoming' },
  { value: 'lucide-PhoneMissed', label: 'Phone Missed' },
  { value: 'lucide-PhoneOff', label: 'Phone Off' },
  { value: 'lucide-PhoneOutgoing', label: 'Phone Outgoing' },
  { value: 'lucide-PieChart', label: 'Pie Chart' },
  { value: 'lucide-Play', label: 'Play' },
  { value: 'lucide-PlayCircle', label: 'Play Circle' },
  { value: 'lucide-Plus', label: 'Plus' },
  { value: 'lucide-PlusCircle', label: 'Plus Circle' },
  { value: 'lucide-PlusSquare', label: 'Plus Square' },
  { value: 'lucide-Pocket', label: 'Pocket' },
  { value: 'lucide-Power', label: 'Power' },
  { value: 'lucide-Printer', label: 'Printer' },
  { value: 'lucide-Radio', label: 'Radio' },
  { value: 'lucide-RefreshCcw', label: 'Refresh Ccw' },
  { value: 'lucide-RefreshCw', label: 'Refresh Cw' },
  { value: 'lucide-Repeat', label: 'Repeat' },
  { value: 'lucide-Rewind', label: 'Rewind' },
  { value: 'lucide-RotateCcw', label: 'Rotate Ccw' },
  { value: 'lucide-RotateCw', label: 'Rotate Cw' },
  { value: 'lucide-Save', label: 'Save' },
  { value: 'lucide-Scissors', label: 'Scissors' },
  { value: 'lucide-Search', label: 'Search' },
  { value: 'lucide-Send', label: 'Send' },
  { value: 'lucide-Server', label: 'Server' },
  { value: 'lucide-Settings', label: 'Settings' },
  { value: 'lucide-Share', label: 'Share' },
  { value: 'lucide-Share2', label: 'Share 2' },
  { value: 'lucide-Shield', label: 'Shield' },
  { value: 'lucide-ShieldOff', label: 'Shield Off' },
  { value: 'lucide-ShoppingBag', label: 'Shopping Bag' },
  { value: 'lucide-ShoppingCart', label: 'Shopping Cart' },
  { value: 'lucide-Shuffle', label: 'Shuffle' },
  { value: 'lucide-Sidebar', label: 'Sidebar' },
  { value: 'lucide-SkipBack', label: 'Skip Back' },
  { value: 'lucide-SkipForward', label: 'Skip Forward' },
  { value: 'lucide-Sliders', label: 'Sliders' },
  { value: 'lucide-Smartphone', label: 'Smartphone' },
  { value: 'lucide-Smile', label: 'Smile' },
  { value: 'lucide-Speaker', label: 'Speaker' },
  { value: 'lucide-Square', label: 'Square' },
  { value: 'lucide-Star', label: 'Star' },
  { value: 'lucide-StopCircle', label: 'Stop Circle' },
  { value: 'lucide-Sun', label: 'Sun' },
  { value: 'lucide-Sunrise', label: 'Sunrise' },
  { value: 'lucide-Sunset', label: 'Sunset' },
  { value: 'lucide-Tablet', label: 'Tablet' },
  { value: 'lucide-Tag', label: 'Tag' },
  { value: 'lucide-Target', label: 'Target' },
  { value: 'lucide-Terminal', label: 'Terminal' },
  { value: 'lucide-Thermometer', label: 'Thermometer' },
  { value: 'lucide-ThumbsDown', label: 'Thumbs Down' },
  { value: 'lucide-ThumbsUp', label: 'Thumbs Up' },
  { value: 'lucide-ToggleLeft', label: 'Toggle Left' },
  { value: 'lucide-ToggleRight', label: 'Toggle Right' },
  { value: 'lucide-Tool', label: 'Tool' },
  { value: 'lucide-Trash', label: 'Trash' },
  { value: 'lucide-Trash2', label: 'Trash 2' },
  { value: 'lucide-TrendingDown', label: 'Trending Down' },
  { value: 'lucide-TrendingUp', label: 'Trending Up' },
  { value: 'lucide-Triangle', label: 'Triangle' },
  { value: 'lucide-Truck', label: 'Truck' },
  { value: 'lucide-Tv', label: 'Tv' },
  { value: 'lucide-Type', label: 'Type' },
  { value: 'lucide-Umbrella', label: 'Umbrella' },
  { value: 'lucide-Unlock', label: 'Unlock' },
  { value: 'lucide-Upload', label: 'Upload' },
  { value: 'lucide-UploadCloud', label: 'Upload Cloud' },
  { value: 'lucide-User', label: 'User' },
  { value: 'lucide-UserCheck', label: 'User Check' },
  { value: 'lucide-UserMinus', label: 'User Minus' },
  { value: 'lucide-UserPlus', label: 'User Plus' },
  { value: 'lucide-Users', label: 'Users' },
  { value: 'lucide-Video', label: 'Video' },
  { value: 'lucide-VideoOff', label: 'Video Off' },
  { value: 'lucide-Voicemail', label: 'Voicemail' },
  { value: 'lucide-Volume', label: 'Volume' },
  { value: 'lucide-Volume1', label: 'Volume 1' },
  { value: 'lucide-Volume2', label: 'Volume 2' },
  { value: 'lucide-VolumeX', label: 'Volume X' },
  { value: 'lucide-Watch', label: 'Watch' },
  { value: 'lucide-Wifi', label: 'Wifi' },
  { value: 'lucide-WifiOff', label: 'Wifi Off' },
  { value: 'lucide-Wind', label: 'Wind' },
  { value: 'lucide-X', label: 'X' },
  { value: 'lucide-XCircle', label: 'X Circle' },
  { value: 'lucide-XSquare', label: 'X Square' },
  { value: 'lucide-ZoomIn', label: 'Zoom In' },
  { value: 'lucide-ZoomOut', label: 'Zoom Out' }
];

export const fontFamilies = [
  { name: 'Default Sans', value: 'sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Abel', value: '"Abel", sans-serif' },
  { name: 'Anton', value: '"Anton", sans-serif' },
  { name: 'Archivo', value: '"Archivo", sans-serif' },
  { name: 'Arimo', value: '"Arimo", sans-serif' },
  { name: 'Asap', value: '"Asap", sans-serif' },
  { name: 'Barlow', value: '"Barlow", sans-serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Bitter', value: '"Bitter", serif' },
  { name: 'Cabin', value: '"Cabin", sans-serif' },
  { name: 'Cairo', value: '"Cairo", sans-serif' },
  { name: 'Caveat', value: '"Caveat", cursive' },
  { name: 'Comfortaa', value: '"Comfortaa", cursive' },
  { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Dosis', value: '"Dosis", sans-serif' },
  { name: 'EB Garamond', value: '"EB Garamond", serif' },
  { name: 'Exo 2', value: '"Exo 2", sans-serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
  { name: 'Heebo', value: '"Heebo", sans-serif' },
  { name: 'Hind', value: '"Hind", sans-serif' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },
  { name: 'Kanit', value: '"Kanit", sans-serif' },
  { name: 'Karla', value: '"Karla", sans-serif' },
  { name: 'Lato', value: '"Lato", sans-serif' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Manrope', value: '"Manrope", sans-serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Mukta', value: '"Mukta", sans-serif' },
  { name: 'Mulish', value: '"Mulish", sans-serif' },
  { name: 'Noto Sans', value: '"Noto Sans", sans-serif' },
  { name: 'Nunito', value: '"Nunito", sans-serif' },
  { name: 'Nunito Sans', value: '"Nunito Sans", sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Outfit', value: '"Outfit", sans-serif' },
  { name: 'Oxygen', value: '"Oxygen", sans-serif' },
  { name: 'PT Sans', value: '"PT Sans", sans-serif' },
  { name: 'PT Serif', value: '"PT Serif", serif' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Quicksand', value: '"Quicksand", sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Roboto Condensed', value: '"Roboto Condensed", sans-serif' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
  { name: 'Roboto Slab', value: '"Roboto Slab", serif' },
  { name: 'Rubik', value: '"Rubik", sans-serif' },
  { name: 'Signika', value: '"Signika", sans-serif' },
  { name: 'Source Sans 3', value: '"Source Sans 3", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Tajawal', value: '"Tajawal", sans-serif' },
  { name: 'Teko', value: '"Teko", sans-serif' },
  { name: 'Titillium Web', value: '"Titillium Web", sans-serif' },
  { name: 'Ubuntu', value: '"Ubuntu", sans-serif' },
  { name: 'Varela Round', value: '"Varela Round", sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif' },
  { name: 'Yanone Kaffeesatz', value: '"Yanone Kaffeesatz", sans-serif' },
  { name: 'Zilla Slab', value: '"Zilla Slab", serif' },

  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Bookman', value: 'Bookman, serif' },
  { name: 'Avant Garde', value: '"Avant Garde", sans-serif' },
  { name: 'Courier', value: 'Courier, monospace' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Arial Black', value: '"Arial Black", sans-serif' },
  { name: 'Lucida Sans Unicode', value: '"Lucida Sans Unicode", sans-serif' },
  { name: 'Lucida Console', value: '"Lucida Console", monospace' },
  { name: 'Monaco', value: 'Monaco, monospace' },
  { name: 'Optima', value: 'Optima, sans-serif' },
  { name: 'Futura', value: 'Futura, sans-serif' },
  { name: 'Baskerville', value: 'Baskerville, serif' },
];

const FieldsPanel: React.FC<FieldsPanelProps> = ({ onSelectField }) => {
  const { currentProject, updateCurrentProject, setIsDrawingMode } = useAppContext();
  const commonPhotoInputRef = useRef<HTMLInputElement>(null);
  
  const [cropTarget, setCropTarget] = useState<{ src: string; type: 'common' | 'update'; fieldId?: string } | null>(null);
  const [showWordArtOptions, setShowWordArtOptions] = useState(false);

  const WORD_ART_PRESETS = [
    { label: 'Classic Elegance', fontFamily: '"Playfair Display", serif', fontSize: 32, color: '#b8860b', fontWeight: 'bold', fontStyle: 'italic' },
    { label: 'Impactful', fontFamily: 'Impact, sans-serif', fontSize: 40, color: '#dc2626', textTransform: 'uppercase' },
    { label: 'Beautiful Script', fontFamily: '"Pacifico", cursive', fontSize: 32, color: '#ec4899' },
    { label: 'Typewriter', fontFamily: '"Courier New", monospace', fontSize: 24, color: '#1f2937', fontWeight: 'bold' },
    { label: 'Playful', fontFamily: '"Comic Sans MS", cursive', fontSize: 28, color: '#8b5cf6' },
    { label: 'Tech Glitch', fontFamily: '"Roboto Mono", monospace', fontSize: 30, color: '#0ea5e9', fontWeight: 'bold', textTransform: 'uppercase' },
  ];

  if (!currentProject) return null;

  const { headers, fields } = currentProject;

  const setFields = (newFields: FieldConfig[] | ((prev: FieldConfig[]) => FieldConfig[])) => {
    if (typeof newFields === 'function') {
      updateCurrentProject({ fields: newFields(fields) });
    } else {
      updateCurrentProject({ fields: newFields });
    }
  };

  const setHeaders = (newHeaders: string[]) => {
    updateCurrentProject({ headers: newHeaders });
  };

  const handleAddField = (headerKey: string, type: FieldConfig['type'] = 'text', isStatic = false, extras?: Partial<FieldConfig>) => {
    const newField: FieldConfig = {
      id: Math.random().toString(36).substr(2, 9),
      headerKey,
      x: 50,
      y: 50,
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      type,
      width: type === 'image' || type === 'shape' || type === 'qrcode' ? 100 : (type === 'barcode' ? 150 : undefined),
      height: type === 'image' || type === 'shape' || type === 'qrcode' ? 100 : (type === 'barcode' ? 50 : undefined),
      isStatic,
      ...extras
    };
    setFields((prev) => [...prev, newField]);
    onSelectField(newField.id);
  };

  const checkKeyUnique = (name: string) => {
    return !fields.some(f => !f.isStatic && f.headerKey.toLowerCase() === name.toLowerCase());
  };

  const handleAddDynamicPhoto = () => {
    const name = window.prompt('Enter Data Key for this photo:', 'Photo');
    if (!name) return;
    if (!checkKeyUnique(name)) {
      window.alert(`The key "${name}" is already in use. Please use a unique key.`);
      return;
    }
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'image', false);
  };

  const handleAddDynamicText = () => {
    const name = window.prompt('Enter Data Key for this text field:', 'Name');
    if (!name) return;
    if (!checkKeyUnique(name)) {
      window.alert(`The key "${name}" is already in use. Please use a unique key.`);
      return;
    }
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'text', false);
  };

  const handleAddDynamicQR = () => {
    const name = window.prompt('Enter Data Key for this QR Code:', 'ID_Number');
    if (!name) return;
    if (!checkKeyUnique(name)) {
      window.alert(`The key "${name}" is already in use. Please use a unique key.`);
      return;
    }
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'qrcode', false);
  };

  const handleAddDynamicBarcode = () => {
    const name = window.prompt('Enter Data Key for this Barcode:', 'ID_Number');
    if (!name) return;
    if (!checkKeyUnique(name)) {
      window.alert(`The key "${name}" is already in use. Please use a unique key.`);
      return;
    }
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'barcode', false);
  };

  const handleAddShape = () => {
    handleAddField(`Shape_${Math.floor(Math.random()*1000)}`, 'shape', true, {
      shapeType: 'rectangle',
      backgroundColor: '#e0e7ff',
      borderColor: '#4f46e5',
      borderWidth: 2,
      borderRadius: 0,
      fillTransparent: false,
      borderTransparent: false,
    });
  };

  const handleAddCommonPhotoClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setCropTarget({ src: result, type: 'common' });
      }
    };
    reader.readAsDataURL(file);
    if (commonPhotoInputRef.current) commonPhotoInputRef.current.value = '';
  };
  const handleCropComplete = (croppedBase64: string) => {
    if (!cropTarget) return;

    if (cropTarget.type === 'common') {
      handleAddField(`StaticImage_${Math.floor(Math.random()*1000)}`, 'image', true, { staticImage: croppedBase64 });
    } else if (cropTarget.type === 'update' && cropTarget.fieldId) {
      updateField(cropTarget.fieldId, { staticImage: croppedBase64 });
    }
    setCropTarget(null);
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {cropTarget && (
        <CropModal 
          imageSrc={cropTarget.src}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}

      {/* Add Data Fields */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm shrink-0">
        <h3 className="text-base font-bold text-gray-900 mb-4">Add Elements</h3>
        
        <div className="space-y-5">
          {/* Dynamic Data Group */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Dynamic Data (Variables)</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddDynamicText}
                className="flex flex-col items-center justify-center gap-1.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 p-3 rounded-lg transition-all group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:scale-110 transition-transform">
                  <Type className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">Text Field</span>
              </button>
              
              <button
                onClick={handleAddDynamicPhoto}
                className="flex flex-col items-center justify-center gap-1.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 p-3 rounded-lg transition-all group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">Image Field</span>
              </button>
              <button
                onClick={handleAddDynamicQR}
                className="flex flex-col items-center justify-center gap-1.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 p-3 rounded-lg transition-all group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:scale-110 transition-transform">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">QR Code</span>
              </button>
              
              <button
                onClick={handleAddDynamicBarcode}
                className="flex flex-col items-center justify-center gap-1.5 bg-indigo-50/50 text-indigo-700 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 p-3 rounded-lg transition-all group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md group-hover:scale-110 transition-transform">
                  <Barcode className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">Barcode</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 px-1 leading-tight whitespace-normal break-words">These fields change value per card based on your uploaded dataset.</p>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* Static Design Group */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Static Design Elements</h4>
            
            <button
              onClick={() => setIsDrawingMode(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors font-bold text-xs mb-3 shadow-sm"
            >
              <PenTool className="w-4 h-4" /> DRAW (BETA)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddField(`StaticText_${Math.floor(Math.random()*1000)}`, 'text', true, { staticText: 'Double click to edit' })}
                className="flex flex-col items-center justify-center gap-1.5 bg-amber-50/50 text-amber-700 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md group-hover:scale-110 transition-transform">
                  <Type className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Text Field</span>
              </button>

              <button
                onClick={() => setShowWordArtOptions(!showWordArtOptions)}
                className={`flex flex-col items-center justify-center gap-1.5 bg-pink-50/50 text-pink-700 border hover:border-pink-300 hover:bg-pink-50 p-2.5 rounded-lg transition-all group ${showWordArtOptions ? 'border-pink-400 bg-pink-100/50 shadow-inner' : 'border-pink-100'}`}
              >
                <div className="p-1.5 bg-pink-100 text-pink-600 rounded-md group-hover:scale-110 transition-transform">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Word Art</span>
              </button>
              
              <button
                onClick={() => commonPhotoInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1.5 bg-emerald-50/50 text-emerald-700 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md group-hover:scale-110 transition-transform">
                  <ImagePlus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Image</span>
              </button>

              <button
                onClick={handleAddShape}
                className="flex flex-col items-center justify-center gap-1.5 bg-purple-50/50 text-purple-700 border border-purple-100 hover:border-purple-300 hover:bg-purple-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md group-hover:scale-110 transition-transform">
                  <Square className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Shape</span>
              </button>

              <button
                onClick={() => handleAddField(`Divider_${Math.floor(Math.random()*1000)}`, 'divider', true, { lineStyle: 'solid', borderWidth: 2, borderColor: '#d1d5db', height: 20, width: 200 })}
                className="flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 text-slate-700 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md group-hover:scale-110 transition-transform">
                  <Minus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Divider</span>
              </button>

              <button
                onClick={() => handleAddField(`StaticQR_${Math.floor(Math.random()*1000)}`, 'qrcode', true, { staticText: 'https://example.com' })}
                className="flex flex-col items-center justify-center gap-1.5 bg-blue-50/50 text-blue-700 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md group-hover:scale-110 transition-transform">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">QR Code</span>
              </button>

              <button
                onClick={() => handleAddField(`StaticBarcode_${Math.floor(Math.random()*1000)}`, 'barcode', true, { staticText: '123456789' })}
                className="flex flex-col items-center justify-center gap-1.5 bg-cyan-50/50 text-cyan-700 border border-cyan-100 hover:border-cyan-300 hover:bg-cyan-50 p-2.5 rounded-lg transition-all group"
              >
                <div className="p-1.5 bg-cyan-100 text-cyan-600 rounded-md group-hover:scale-110 transition-transform">
                  <Barcode className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold">Barcode</span>
              </button>
            </div>
            
            {showWordArtOptions && (
              <div className="mt-3 p-3 bg-pink-50/30 border border-pink-100 rounded-lg">
                <h5 className="text-[10px] font-bold text-pink-700 uppercase mb-2">Choose Word Art Style</h5>
                <div className="grid grid-cols-2 gap-2">
                  {WORD_ART_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const { label, ...styles } = preset;
                        handleAddField(`WordArt_${Math.floor(Math.random()*1000)}`, 'text', true, { staticText: label, ...styles } as any);
                        setShowWordArtOptions(false);
                      }}
                      className="p-2 bg-white border border-pink-100 rounded hover:border-pink-400 hover:shadow-sm transition-all text-center overflow-hidden"
                      style={{ 
                        fontFamily: preset.fontFamily, 
                        color: preset.color, 
                        fontStyle: preset.fontStyle || 'normal', 
                        fontWeight: preset.fontWeight || 'normal',
                        textTransform: (preset as any).textTransform || 'none'
                      }}
                    >
                      <span className="text-xs">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-2 px-1 leading-tight whitespace-normal break-words">These elements remain the same across all cards (e.g. logos, labels, backgrounds).</p>
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={commonPhotoInputRef}
            onChange={handleAddCommonPhotoClick}
          />
        </div>
      </div>

    </div>
  );
};

export default FieldsPanel;
