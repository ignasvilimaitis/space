import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh} from "three"

interface CubeProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export function Cube({ position, size, color }: CubeProps) {
  const ref = useRef<Mesh>(null!)

  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.5
    ref.current.rotation.y += delta * 0.75
  })

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}