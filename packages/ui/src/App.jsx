import Navbar from './components/Navbar';
import Background from './components/Background';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen font-sans text-gray-100">
      <Background />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        {/* Showcase Header */}
        <section className="mb-24 flex flex-col items-center justify-center pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            BitToByte UI Components
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-7xl">
            Building Blocks for <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Modern Interfaces
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-400">
            A showcase of the reusable React components exported by the
            <code> bittobyte-ui </code> package. Scroll down to see the Navbar's
            glassmorphism effect and explore the components.
          </p>
        </section>

        {/* Component Demos */}
        <div className="space-y-32">
          {/* Navbar Demo */}
          <section id="capabilities">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
              Navbar
            </h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-gray-400 mb-6">
                A responsive navigation bar with a glassmorphic blur effect that
                activates on scroll. It includes a logo, navigation links, and a
                GitHub link.
              </p>
              <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
                <div className="absolute top-0 w-full">
                  {/* Inline demo version of Navbar for display purposes */}
                  <Navbar />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pt-16">
                  <span className="text-sm text-gray-500">
                    Scroll inside the main window to see the actual Navbar's effect
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Background Demo */}
          <section id="projects">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
              Background
            </h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-gray-400 mb-6">
                An ambient, animated background featuring drifting colored auroras
                and a masking grid to provide depth without distracting from content.
                It's currently active behind this page.
              </p>
              <div className="relative h-64 overflow-hidden rounded-xl border border-white/10">
                <Background />
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40 backdrop-blur-[2px]">
                  <span className="text-sm font-medium text-white px-4 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md">
                    Active Environment
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Demo */}
          <section id="stack">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
              Footer
            </h2>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-gray-400 mb-6">
                A standard application footer with logo, tagline, GitHub integration,
                copyright information, and a pulsing status indicator.
              </p>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#030712]">
                <Footer />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;