import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Building3DProps {
  level: number;
  position: [number, number, number];
  isLocked: boolean;
  isActive: boolean;
  isCompleted: boolean;
  isBoss: boolean;
  onClick: () => void;
}

const buildingColors = [
  '#FFB6C1', // Pink
  '#90EE90', // Light green
  '#87CEEB', // Sky blue  
  '#FFE4B5', // Peach
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFA07A', // Light salmon
  '#98FB98', // Pale green
  '#DEB887', // Burlywood
  '#A855F7', // Purple (boss)
];

export const Building3D = ({
  level,
  position,
  isLocked,
  isActive,
  isCompleted,
  isBoss,
  onClick,
}: Building3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Building height and style based on level
  const getBuildingStyle = () => {
    if (isBoss) return { height: 10, width: 2, depth: 2, type: 'skyscraper' };
    if (level >= 7) return { height: 5 + (level - 6) * 0.5, width: 1.8, depth: 1.8, type: 'office' };
    if (level >= 5) return { height: 3 + (level - 4) * 0.4, width: 1.6, depth: 1.6, type: 'apartment' };
    if (level >= 3) return { height: 2 + (level - 2) * 0.3, width: 1.4, depth: 1.4, type: 'shop' };
    return { height: 1.5 + level * 0.2, width: 1.2, depth: 1.2, type: 'house' };
  };

  const style = getBuildingStyle();
  const height = style.height;

  // Color based on state
  const getColor = () => {
    if (isLocked) return '#9CA3AF'; // Gray
    if (isCompleted) return '#34D399'; // Bright green
    if (isActive) return '#60A5FA'; // Bright blue
    return buildingColors[level - 1]; // Use vibrant color palette
  };

  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isBoss && !isLocked) {
      // Boss building pulses
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      meshRef.current.scale.set(scale, 1, scale);
    } else if (hovered && !isLocked) {
      // Hover effect - lift up slightly
      meshRef.current.position.y = height / 2 + 0.2;
    } else {
      meshRef.current.position.y = height / 2;
    }

    // Locked buildings shake slightly
    if (isLocked) {
      const shake = Math.sin(state.clock.elapsedTime * 10) * 0.01;
      meshRef.current.rotation.z = shake;
    }
  });

  // Render roof based on building type
  const renderRoof = () => {
    if (style.type === 'house' || style.type === 'shop') {
      return (
        <mesh position={[0, height + 0.3, 0]}>
          <coneGeometry args={[style.width * 0.7, 0.6, 4]} />
          <meshStandardMaterial color="#8B4513" flatShading />
        </mesh>
      );
    }
    if (isBoss) {
      return (
        <mesh position={[0, height + 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.8, 1, 4]} />
          <meshStandardMaterial color="#F59E0B" flatShading />
        </mesh>
      );
    }
    return null;
  };

  return (
    <group position={position}>
      {/* Ground base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[style.width * 0.6, style.width * 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#6B7280" flatShading />
      </mesh>

      {/* Main Building */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[style.width, height, style.depth]} />
        <meshStandardMaterial 
          color={getColor()} 
          flatShading
          transparent={isLocked}
          opacity={isLocked ? 0.6 : 1}
          roughness={0.7}
        />
      </mesh>

      {/* Windows - grid pattern */}
      {!isLocked && Array.from({ length: Math.floor(height / 0.8) }).map((_, floor) => (
        <group key={floor}>
          {[0, 1].map((col) => (
            <mesh 
              key={col} 
              position={[
                (col - 0.5) * style.width * 0.4,
                0.4 + floor * 0.8,
                style.depth / 2 + 0.01
              ]}
            >
              <boxGeometry args={[0.25, 0.3, 0.02]} />
              <meshStandardMaterial color="#FCD34D" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Door */}
      {!isLocked && (
        <mesh position={[0, 0.4, style.depth / 2 + 0.01]}>
          <boxGeometry args={[0.3, 0.6, 0.02]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>
      )}

      {/* Roof */}
      {renderRoof()}

      {/* Level Number as HTML */}
      <Html position={[0, height + 1, 0]} center>
        <div className="text-white text-xl font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
          {level}
        </div>
      </Html>

      {/* Lock Icon for locked levels */}
      {isLocked && (
        <mesh position={[0, height + 0.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#EF4444" flatShading />
        </mesh>
      )}

      {/* Completion checkmark */}
      {isCompleted && (
        <mesh position={[0, height + 0.5, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#10B981" flatShading />
        </mesh>
      )}
    </group>
  );
};
