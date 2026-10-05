

import React, { useRef, type JSX } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Group, Material, Mesh } from 'three'
import type { GLTF } from 'three/examples/jsm/Addons.js'
import { getOrbitCurve, setPlanetPosition } from '../../functions/orbitData'
import { loadPlanetaryData } from '../../hooks/loadSinglePlanet'

interface NeptuneGLTF extends GLTF {
    nodes: {
        Neptune: Mesh
    }

    materials: {
        'Default OBJ.001': Material
    }
}

type PlanetProps = JSX.IntrinsicElements['group'] & {
  date: string
}

export function NeptuneModel({date, ...props} : PlanetProps) {
  const group = useRef<Group>(null)
  const { nodes, materials } = useGLTF('/neptune.glb') as unknown as NeptuneGLTF
    const { data: neptuneData } = loadPlanetaryData('neptune', date)
  
    const orbit = getOrbitCurve(neptuneData)
  
    setPlanetPosition(orbit, group)
  return (
    <group ref = {group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Neptune.geometry}
        material={materials['Default OBJ.001']}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

useGLTF.preload('/neptune.glb')