import * as THREE from 'three';

interface Tree3DProps {
  position: [number, number, number];
  scale?: number;
  foliageColor?: string;
}

export const Tree3D = ({ 
  position, 
  scale = 1,
  foliageColor = '#2D5016'
}: Tree3DProps) => {
  const trunkHeight = 0.8 * scale;
  const foliageSize = 0.6 * scale;

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.1 * scale, 0.12 * scale, trunkHeight, 8]} />
        <meshStandardMaterial color="#6B4423" flatShading />
      </mesh>

      {/* Foliage - bottom tier */}
      <mesh position={[0, trunkHeight + foliageSize * 0.3, 0]}>
        <coneGeometry args={[foliageSize, foliageSize * 1.2, 8]} />
        <meshStandardMaterial color={foliageColor} flatShading />
      </mesh>

      {/* Foliage - middle tier */}
      <mesh position={[0, trunkHeight + foliageSize * 0.7, 0]}>
        <coneGeometry args={[foliageSize * 0.75, foliageSize, 8]} />
        <meshStandardMaterial color={foliageColor} flatShading />
      </mesh>

      {/* Foliage - top tier */}
      <mesh position={[0, trunkHeight + foliageSize * 1.1, 0]}>
        <coneGeometry args={[foliageSize * 0.5, foliageSize * 0.7, 8]} />
        <meshStandardMaterial color={foliageColor} flatShading />
      </mesh>
    </group>
  );
};
