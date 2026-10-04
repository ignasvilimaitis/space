import './App.css'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { SunModel } from './components/models/sun'
import { OrbitControls } from '@react-three/drei'
import { StarBackground } from './components/scene/StarBackground'
import { EarthModel } from './components/models/earth'
import { MercuryModel } from './components/models/mercury'
import { VenusModel } from './components/models/venus'
import { loadAllPlanetaryData } from './hooks/loadPlanets'
import { MarsModel } from './components/models/mars'
import { JupiterModel } from './components/models/jupiter'
import { UranusModel } from './components/models/uranus'
import { NeptuneModel } from './components/models/neptune'
import { SaturnModel } from './components/models/saturn'
import TimeControl, { useSimClock } from './components/menu/timeControl'
import { getCurrentClock } from './functions/convertDate'

function App() {

  const {data: planetData, loading, error} = loadAllPlanetaryData();
  const clock = useSimClock()
  if (loading) {
    return <div>Loading planetary data...</div>;
  } else if (error) {
    return <div>Error loading planetary data: {error}</div>;
  }

  return (
    <div className="app">
      <StarBackground/>
      <TimeControl clock={clock} corner="bottom-right"/>
  <Canvas camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000000 }}>
  <ambientLight intensity={1.3} />
  <directionalLight position={[0, 0, 0]} intensity={10} />
    <pointLight position={[0, 0, 0]} intensity={5000} decay={2} />

  <OrbitControls />
  <Suspense fallback={null}>
    <SunModel scale={0.5} position={[0, 0, 0]} />
    <EarthModel scale={0.01} position={[(planetData["earth"][0]["x"]/1000000), (planetData["earth"][0]["y"]/1000000), (planetData["earth"][0]["z"]/1000000)]} />
    <MercuryModel scale = {0.01} position = {[(planetData["mercury"][0]["x"]/1000000), (planetData["mercury"][0]["y"]/1000000), (planetData["mercury"][0]["z"]/1000000)]}></MercuryModel>
    <VenusModel scale = {0.01} position = {[(planetData["venus"][0]["x"]/1000000), (planetData["venus"][0]["y"]/1000000), (planetData["venus"][0]["z"]/1000000)]}></VenusModel>
    <MarsModel scale = {0.01} position = {[(planetData["mars"][0]["x"]/1000000), (planetData["mars"][0]["y"]/1000000), (planetData["mars"][0]["z"]/1000000)]}></MarsModel>
    <JupiterModel scale = {0.01} position = {[(planetData["jupiter"][0]["x"]/1000000), (planetData["jupiter"][0]["y"]/1000000), (planetData["jupiter"][0]["z"]/1000000)]}></JupiterModel>
    <SaturnModel scale = {0.01} position = {[(planetData["saturn"][0]["x"]/1000000), (planetData["saturn"][0]["y"]/1000000), (planetData["saturn"][0]["z"]/1000000)]}></SaturnModel>
    <UranusModel scale = {0.01} position = {[(planetData["uranus"][0]["x"]/1000000), (planetData["uranus"][0]["y"]/1000000), (planetData["uranus"][0]["z"]/1000000)]}></UranusModel>
    <NeptuneModel scale = {0.01} position = {[(planetData["neptune"][0]["x"]/1000000), (planetData["neptune"][0]["y"]/1000000), (planetData["neptune"][0]["z"]/1000000)]}></NeptuneModel>
  </Suspense>
</Canvas>
    </div>
  )
}

export default App