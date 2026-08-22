import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Not found · Alejandro Martínez', 'That page does not exist.');

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm tracking-widest text-[#b5f53c]">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        Nothing lives at this address
      </h1>
      <p className="mt-4 text-gray-400">
        The link is either mistyped or points at something that has since moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-[#b5f53c] px-6 py-2.5 text-sm font-semibold text-gray-950 transition-transform hover:scale-105"
        >
          Home
        </Link>
        <Link
          to="/work"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          All work
        </Link>
      </div>
    </div>
  );
}
