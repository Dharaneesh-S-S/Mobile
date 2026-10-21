import React from 'react'
import {
  Camera,
  PlaySquare,
  Music2,
  MessageCircle,
  Globe,
  Flame,
  Headphones,
  Hash,
  MapPin,
  GraduationCap,
  Gamepad2,
  Tv,
  Smartphone,
  LucideProps,
} from 'lucide-react'

interface AppIconProps {
  name: string
  iconName?: string
  color?: string
  size?: number
  className?: string
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  Camera,
  PlaySquare,
  Music2,
  MessageCircle,
  Globe,
  Flame,
  Headphones,
  Hash,
  MapPin,
  GraduationCap,
  Gamepad2,
  Tv,
  Smartphone,
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  iconName = 'Smartphone',
  color = '#3b82f6',
  size = 20,
  className = '',
}) => {
  const IconComponent = iconMap[iconName] || Smartphone

  return (
    <div
      className={`rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform active:scale-95 ${className}`}
      style={{
        backgroundColor: color,
        width: size * 2,
        height: size * 2,
      }}
      aria-label={`${name} icon`}
    >
      <IconComponent size={size} strokeWidth={2.2} />
    </div>
  )
}
