// Wrapper pour remplacer next/image avec img standard
import { ImgHTMLAttributes } from 'react';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export default function Image({ src, alt, fill, className = '', ...props }: ImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${className}`}
        {...props}
      />
    );
  }

  return <img src={src} alt={alt} className={className} {...props} />;
}