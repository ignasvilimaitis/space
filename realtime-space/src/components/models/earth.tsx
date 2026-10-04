

import React, { useMemo, useRef, type JSX } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Mesh, Material, Group, Vector3 } from 'three'
import type { GLTF } from 'three/examples/jsm/Addons.js'
import { useFrame } from '@react-three/fiber'
import { loadPlanetaryData } from '../../hooks/loadSinglePlanet'
import { CatmullRomCurve3 } from 'three'
import { getOrbitCurve, setPlanetPosition } from '../../functions/orbitData'

interface EarthGLTF extends GLTF {
  nodes: {
    Cube001: Mesh
  }
  materials: {
    'Default OBJ': Material
  }
}

const SCALE = 1 / 1_000_000   
const STEP_HOURS = 1            
const HOURS_PER_SECOND = 1        

export function EarthModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null)
  const { nodes, materials, animations } = useGLTF('/earth.glb') as unknown as EarthGLTF
  const { actions } = useAnimations(animations, group)
  const { data: earthData, loading, error} = loadPlanetaryData("earth");

  const orbit = getOrbitCurve(earthData)

  setPlanetPosition(orbit, group)
  
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials['Default OBJ']}
      />
    </group>
  )
}

useGLTF.preload('/earth.glb')