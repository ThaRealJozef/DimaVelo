// Wrapper pour remplacer next/link avec react-router-dom Link
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { ReactNode } from 'react';

interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string;
  children: ReactNode;
}

export default function Link({ href, children, ...props }: LinkProps) {
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}