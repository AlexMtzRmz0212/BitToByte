import { ArrowUpRight, MapPin } from 'lucide-react';
import Reveal from './Reveal';

// Bridge from the BitToByte network hub to Alex's personal portfolio.
const PORTFOLIO_URL = 'https://alex.bittobyte.qzz.io';

const PortfolioCallout = () => (
  <section id="portfolio" className="relative mx-auto max-w-7xl px-6 pb-28 pt-12">
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl md:p-14">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />

        <div className="relative grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Meet the engineer building it all
            </h2>
            <p className="mt-4 max-w-xl text-base text-gray-400 md:text-lg">
              BitToByte is one engineer's studio. Head to the portfolio for the full story, the
              complete project catalog, and the fastest way to get in touch.
            </p>
            <a
              href={PORTFOLIO_URL}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:brightness-110"
            >
              Visit the portfolio
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Profile card */}
          <a
            href={PORTFOLIO_URL}
            className="group relative block rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                AM
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">Alejandro Martinez</p>
                <p className="text-sm text-gray-400">AI &amp; Automation Engineer</p>
              </div>
            </div>

            <p className="mt-5 text-xs text-gray-400">AI, Automation, Data Viz, Mechatronics</p>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-400" />
                alex.bittobyte.qzz.io
              </span>
              <ArrowUpRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
            </div>
          </a>
        </div>
      </div>
    </Reveal>
  </section>
);

export default PortfolioCallout;
