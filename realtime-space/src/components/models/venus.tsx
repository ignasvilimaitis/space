import React, { useRef, type JSX } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Mesh, Material, Group } from 'three'
import type { GLTF } from 'three/examples/jsm/Addons.js'
import { useFrame } from '@react-three/fiber'
import { loadPlanetaryData } from '../../hooks/loadSinglePlanet'
import { getOrbitCurve, setPlanetPosition } from '../../functions/orbitData'

interface VenusGLTF extends GLTF {
    nodes: {
        cylindrically_mapped_sphere: Mesh;
    }
    materials: {
        'Default OBJ.001': Material;
    }
}

export function VenusModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null)
  const { nodes, materials } = useGLTF('/venus.glb') as unknown as VenusGLTF;
    const { data: venusData, loading, error} = loadPlanetaryData("venus")
    
    const orbit = getOrbitCurve(venusData)

    setPlanetPosition(orbit, group)

  return (
    <group ref = {group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cylindrically_mapped_sphere.geometry}
        material={materials['Default OBJ.001']}
      />
    </group>
  )
}

useGLTF.preload('/venus.glb')
