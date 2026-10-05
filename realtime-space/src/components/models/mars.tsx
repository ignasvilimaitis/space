

import React, { useRef, type JSX } from 'react'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three/examples/jsm/Addons.js'
import type { Group, Material, Mesh } from 'three'
import { loadPlanetaryData } from '../../hooks/loadSinglePlanet'
import { getOrbitCurve, setPlanetPosition } from '../../functions/orbitData'

interface MarsGLTF extends GLTF {
    nodes: {
        Cube008: Mesh
    }

    materials: {
        'Default OBJ.005': Material
    }
}

type PlanetProps = JSX.IntrinsicElements['group'] & {
  date: string
}

export function MarsModel({date, ...props} : PlanetProps) {
  const group = useRef<Group>(null)
  const { nodes, materials } = useGLTF('/mars.glb') as unknown as MarsGLTF
  const {data: marsData, loading, error} = loadPlanetaryData("mars", date)

  const orbit = getOrbitCurve(marsData)
  setPlanetPosition(orbit, group)

  return (
    <group ref = {group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008.geometry}
        material={materials['Default OBJ.005']}
      />
    </group>
  )
}

useGLTF.preload('/mars.glb')