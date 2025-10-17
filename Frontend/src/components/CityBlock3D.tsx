interface CityBlockProps {
  position: [number, number, number];
  size?: number;
}

export const CityBlock3D = ({ position, size = 3 }: CityBlockProps) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[size, 32]} />
      <meshStandardMaterial color="#4ADE80" flatShading />
    </mesh>
  );
};
