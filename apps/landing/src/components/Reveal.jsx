// src/components/Reveal.jsx
import { useReveal } from '../hooks/useReveal';

/**
 * Wraps children and reveals them (fade + lift) when scrolled into view.
 * `delay` staggers grouped items; `as` lets you change the rendered tag.
 */
const Reveal = ({ children, delay = 0, className = '', as: Tag = 'div' }) => {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` }}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
