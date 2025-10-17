import * as THREE from 'three';

interface Road3DProps {
  start: [number, number, number];
  end: [number, number, number];
  width?: number;
}

export const Road3D = ({ start, end, width = 1.5 }: Road3DProps) => {
  // Calculate midpoint and rotation
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Calculate rotation to align with direction
  const rotationY = Math.atan2(dx, dz);

  return (
    <group>
      {/* Road surface */}
      <mesh position={midPoint} rotation={[-Math.PI / 2, 0, rotationY]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#4B5563" flatShading />
      </mesh>

      {/* Road markings - dashed center line */}
      {Array.from({ length: Math.floor(length / 0.8) }).map((_, i) => {
        if (i % 2 === 0) {
          const t = i / Math.floor(length / 0.8);
          const markPos: [number, number, number] = [
            start[0] + dx * t,
            start[1] + 0.01,
            start[2] + dz * t,
          ];
          return (
            <mesh key={i} position={markPos} rotation={[-Math.PI / 2, 0, rotationY]}>
              <planeGeometry args={[0.1, 0.4]} />
              <meshBasicMaterial color="#FCD34D" />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
};
