import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate, type NavMode } from '../state/app';
import { routeToSearch, type Route } from '../state/url';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: Route;
  mode?: NavMode;
};

/**
 * A real link to an in-app route. It works without JavaScript and with
 * middle-click / cmd-click (new tab); a plain click navigates in place.
 */
export default function RouteLink({ to, mode = 'push', onClick, ...rest }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to, mode);
  };
  return <a {...rest} href={routeToSearch(to)} onClick={handleClick} />;
}
