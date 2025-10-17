import { Building3D } from './Building3D';
import { Tree3D } from './Tree3D';
import { Road3D } from './Road3D';
import { CityBlock3D } from './CityBlock3D';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useGameState } from '@/hooks/useGameState';

interface SpiralStaircase3DProps {
  onBossClick: () => void;
  onLevelClick: (level: number) => void;
}

export const SpiralStaircase3D = ({ onBossClick, onLevelClick }: SpiralStaircase3DProps) => {
  const { currentLevel, completedLevels } = useGameState();

  const getCityPosition = (level: number): [number, number, number] => {
    // Arrange buildings in a loose circular pattern expanding outward
    const angle = ((level - 1) / 10) * Math.PI * 2.5;
    const radius = 3 + (level - 1) * 0.8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0; // All at ground level
    return [x, y, z];
  };

  const handleBuildingClick = (level: number) => {
    if (level === 10 && completedLevels.includes(9)) {
      onBossClick();
    } else if (level === currentLevel) {
      onLevelClick(level);
    }
  };

  const treeColors = ['#2D5016', '#3A6B1F', '#458B2A', '#52A332'];

  return (
    <>
      {/* Camera - More isometric/aerial view */}
      <PerspectiveCamera makeDefault position={[0, 28, 12]} fov={45} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={15}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.3}
      />

      {/* Lighting - Bright and cheerful */}
      <ambientLight intensity={1} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 15, -5]} intensity={0.4} />
      
      {/* Sky background */}
      <color attach="background" args={['#87CEEB']} />

      {/* Ground - Large grass area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color="#4ADE80" flatShading />
      </mesh>

      {/* Buildings in city layout */}
      {Array.from({ length: 10 }, (_, i) => {
        const level = i + 1;
        const position = getCityPosition(level);
        const isLocked = level > currentLevel;
        const isActive = level === currentLevel;
        const isCompleted = completedLevels.includes(level);
        const isBoss = level === 10;

        return (
          <group key={level}>
            {/* City block (grass patch) */}
            <CityBlock3D position={position} size={2.5} />
            
            {/* Building */}
            <Building3D
              level={level}
              position={position}
              isLocked={isLocked}
              isActive={isActive}
              isCompleted={isCompleted}
              isBoss={isBoss}
              onClick={() => handleBuildingClick(level)}
            />

            {/* Trees around building */}
            <Tree3D 
              position={[position[0] + 1.5, 0, position[2] + 1]} 
              scale={0.8}
              foliageColor={treeColors[i % treeColors.length]}
            />
            <Tree3D 
              position={[position[0] - 1.2, 0, position[2] + 1.5]} 
              scale={0.7}
              foliageColor={treeColors[(i + 1) % treeColors.length]}
            />
            <Tree3D 
              position={[position[0] + 1, 0, position[2] - 1.5]} 
              scale={0.9}
              foliageColor={treeColors[(i + 2) % treeColors.length]}
            />
          </group>
        );
      })}

      {/* Roads connecting buildings */}
      {Array.from({ length: 10 }, (_, i) => {
        if (i === 9) return null;
        const start = getCityPosition(i + 1);
        const end = getCityPosition(i + 2);
        
        return (
          <Road3D 
            key={`road-${i}`} 
            start={start} 
            end={end}
            width={1.2}
          />
        );
      })}

      {/* Additional decorative trees */}
      <Tree3D position={[0, 0, 0]} scale={1.2} foliageColor="#2D5016" />
      <Tree3D position={[-5, 0, -5]} scale={1} foliageColor="#3A6B1F" />
      <Tree3D position={[6, 0, -4]} scale={0.9} foliageColor="#458B2A" />

      {/* Soft fog */}
      <fog attach="fog" args={['#87CEEB', 25, 50]} />
    </>
  );
};
