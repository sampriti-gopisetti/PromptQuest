import { CosmicBackground } from '@/components/CosmicBackground';
import { ParticleField } from '@/components/ParticleField';
import { AbyssMap } from '@/components/AbyssMap';
import { PlayerStatus } from '@/components/PlayerStatus';

const Index = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Layered backgrounds with parallax */}
      <CosmicBackground />
      <ParticleField />

      {/* Player stats */}
      <PlayerStatus points={2850} level={7} />

      {/* The main abyss map */}
      <AbyssMap />

      {/* Chromatic aberration overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
        }}
      />
    </main>
  );
};

export default Index;
