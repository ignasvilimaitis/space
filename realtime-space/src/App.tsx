import './App.css'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { SunModel } from './components/models/sun'
import { OrbitControls } from '@react-three/drei'
import { StarBackground } from './components/scene/StarBackground'
import { EarthModel } from './components/models/earth'
import { MercuryModel } from './components/models/mercury'
import { VenusModel } from './components/models/venus'
import { MarsModel } from './components/models/mars'
import { JupiterModel } from './components/models/jupiter'
import { UranusModel } from './components/models/uranus'
import { NeptuneModel } from './components/models/neptune'
import { SaturnModel } from './components/models/saturn'
import TimeControl, { useSimClock } from './components/menu/timeControl'
import { calculateWindow } from './functions/windowCalculation'
import { getCurrentClock } from './functions/convertDate'

function App() {

  const clock = useSimClock()
  calculateWindow(clock);
  
  const currentTime = getCurrentClock(clock)

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
    <EarthModel scale={0.01} date={currentTime} />
    <MercuryModel scale={0.01} date={currentTime}></MercuryModel>
    <VenusModel scale={0.01} date={currentTime}></VenusModel>
    <MarsModel scale={0.01} date={currentTime}></MarsModel>
    <JupiterModel scale={0.01} date={currentTime}></JupiterModel>
    <SaturnModel scale={0.01} date={currentTime} ></SaturnModel>
    <UranusModel scale={0.01} date={currentTime}></UranusModel>
    <NeptuneModel scale={0.01} date={currentTime} ></NeptuneModel>
  </Suspense>
</Canvas>
    </div>
  )
}

export default App