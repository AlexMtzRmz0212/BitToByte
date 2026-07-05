import { useReveal } from '../hooks/useReveal';

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