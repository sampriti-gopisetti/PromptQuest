import { Building3D } from './Building3D';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { useGameState } from '@/hooks/useGameState';

interface SpiralStaircase3DProps {
  onBossClick: () => void;
  onLevelClick: (level: number) => void;
}

export const SpiralStaircase3D = ({ onBossClick, onLevelClick }: SpiralStaircase3DProps) => {
  const { currentLevel, completedLevels } = useGameState();

  const getSpiralPosition = (level: number): [number, number, number] => {
    const angle = ((level - 1) / 10) * Math.PI * 4; // 2 full rotations
    const radius = 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (level - 1) * 1.5;
    return [x, y, z];
  };

  const handleBuildingClick = (level: number) => {
    if (level === 10 && completedLevels.includes(9)) {
      onBossClick();
    } else if (level === currentLevel) {
      onLevelClick(level);
    }
  };

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[12, 15, 12]} fov={50} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={15}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#3B82F6" />
      
      {/* Environment */}
      <Environment preset="sunset" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Buildings on spiral */}
      {Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        const position = getSpiralPosition(level);
        const isLocked = level > currentLevel;
        const isActive = level === currentLevel;
        const isCompleted = completedLevels.includes(level);
        const isBoss = level === 10;

        return (
          <Building3D
            key={level}
            level={level}
            position={position}
            isLocked={isLocked}
            isActive={isActive}
            isCompleted={isCompleted}
            isBoss={isBoss}
            onClick={() => handleBuildingClick(level)}
          />
        );
      })}

      {/* Spiral path/stairs connecting buildings */}
      {Array.from({ length: 10 }, (_, i) => {
        if (i === 9) return null;
        const start = getSpiralPosition(i + 1);
        const end = getSpiralPosition(i + 2);
        const midPoint: [number, number, number] = [
          (start[0] + end[0]) / 2,
          (start[1] + end[1]) / 2,
          (start[2] + end[2]) / 2,
        ];
        
        return (
          <mesh key={`path-${i}`} position={midPoint}>
            <boxGeometry args={[0.3, 0.1, 2]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        );
      })}

      {/* Fog */}
      <fog attach="fog" args={['#0F172A', 20, 50]} />
    </>
  );
};
