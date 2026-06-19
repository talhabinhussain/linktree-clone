import { getIconComponent } from '@/lib/icons';

interface IconPreviewProps {
  iconName: string;
  size?: number;
  className?: string;
}

export default function IconPreview({ iconName, size = 16, className = '' }: IconPreviewProps) {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent size={size} className={className} />;
}
