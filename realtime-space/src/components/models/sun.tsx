import { useRef, type JSX } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { Group, Mesh, Material } from 'three'
import type { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'


interface SunGLTF extends GLTF {
  nodes: {
    UnstableStarCore_1_0: Mesh
    UnstableStarref_2_0: Mesh
  }
  materials: {
    material: Material
    material_1: Material
  }
}

export function SunModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null)
  const { nodes, materials, animations } = useGLTF('/sun.glb') as unknown as SunGLTF
  const { actions } = useAnimations(animations, group)

  nodes.UnstableStarCore_1_0.geometry.computeBoundingBox()

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1
    }
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="3a2aaa22fb3d4b329318a980ad1bf6d1fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="UnstableStarCore" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name="UnstableStarCore_1_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.UnstableStarCore_1_0.geometry}
                    material={materials.material}
                  />
                </group>
                <group name="UnstableStarref" rotation={[-Math.PI / 2, 0, 0]} scale={1.01}>
                  <mesh
                    name="UnstableStarref_2_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.UnstableStarref_2_0.geometry}
                    material={materials.material_1}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/sun.glb')