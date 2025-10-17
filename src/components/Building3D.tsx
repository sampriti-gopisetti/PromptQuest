import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Sphere, Html } from '@react-three/drei';
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

  // Building height based on level
  const height = isBoss ? 8 : level >= 7 ? 4 + (level - 6) * 0.5 : level >= 4 ? 2 + (level - 3) * 0.5 : 1 + level * 0.3;

  // Color based on state
  const getColor = () => {
    if (isLocked) return '#6B7280'; // Gray
    if (isBoss) return '#A855F7'; // Purple
    if (isCompleted) return '#10B981'; // Green
    if (isActive) return '#3B82F6'; // Blue
    return '#94A3B8'; // Light gray
  };

  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isBoss && !isLocked) {
      // Boss building pulses
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (hovered) {
      // Hover effect - lift up
      meshRef.current.position.y = position[1] + height / 2 + 0.3;
    } else {
      meshRef.current.position.y = position[1] + height / 2;
    }

    // Locked buildings shake slightly
    if (isLocked) {
      const shake = Math.sin(state.clock.elapsedTime * 10) * 0.02;
      meshRef.current.rotation.z = shake;
    }
  });

  return (
    <group position={position}>
      {/* Platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* Building */}
      <RoundedBox
        ref={meshRef}
        args={[1.5, height, 1.5]}
        radius={0.1}
        smoothness={4}
        position={[0, height / 2, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshToonMaterial 
          color={getColor()} 
          transparent={isLocked}
          opacity={isLocked ? 0.5 : 1}
          emissive={!isLocked && (isActive || isBoss) ? getColor() : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </RoundedBox>

      {/* Windows */}
      {!isLocked && Array.from({ length: Math.floor(height) }).map((_, i) => (
        <mesh key={i} position={[0.76, 0.5 + i * 1.2, 0]}>
          <boxGeometry args={[0.01, 0.3, 0.3]} />
          <meshBasicMaterial color="#FCD34D" />
        </mesh>
      ))}

      {/* Level Number as HTML */}
      <Html position={[0, height + 0.5, 0.76]} center>
        <div className="text-white text-2xl font-bold bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
          {level}
        </div>
      </Html>

      {/* Lock Icon for locked levels */}
      {isLocked && (
        <Sphere args={[0.3, 16, 16]} position={[0, height + 0.8, 0]}>
          <meshStandardMaterial color="#EF4444" />
        </Sphere>
      )}

      {/* Crown for boss */}
      {isBoss && !isLocked && (
        <mesh position={[0, height + 1, 0]} rotation={[0, Date.now() * 0.001, 0]}>
          <coneGeometry args={[0.5, 0.8, 4]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Completion checkmark */}
      {isCompleted && (
        <Sphere args={[0.4, 16, 16]} position={[0, height + 0.8, 0]}>
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
        </Sphere>
      )}
    </group>
  );
};
