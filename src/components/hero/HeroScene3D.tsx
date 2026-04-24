'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, RoundedBox, Text } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

// ── Tile catalogue ──────────────────────────────────────────────────────────
// Each tile is a rounded box rendered at the listed position/rotation.
// Depth varies to create layered parallax around the phone.

type Tile = {
  label: string
  color: string
  fg?: string
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: number
  floatSpeed?: number
  floatIntensity?: number
}

const TILES: Tile[] = [
  { label: 'N',   color: '#E50914', position: [-2.2,  1.3,  0.4 ], rotation: [0, 0.35, 0.1],  size: 0.9, floatSpeed: 1.2 },
  { label: 'S',   color: '#1DB954', position: [-1.0,  1.9, -0.2 ], rotation: [0, -0.1, -0.05], size: 0.85, floatSpeed: 0.9 },
  { label: '▶',   color: '#FF0000', position: [ 0.6,  2.1,  0.2 ], rotation: [0, -0.3, 0.04], size: 0.85, floatSpeed: 1.4 },
  { label: 'D+',  color: '#0063E5', position: [ 2.2,  1.5,  0.0 ], rotation: [0, -0.5, -0.08], size: 0.9,  floatSpeed: 1.1 },
  { label: '⊞',   color: '#111111', fg: '#FACC15', position: [-2.6, -0.2,  0.1 ], rotation: [0, 0.4, -0.04], size: 0.85, floatSpeed: 1.3 },
  { label: 'P',   color: '#00A8E1', position: [-0.6, -1.1,  0.6 ], rotation: [0, 0.1, 0.06], size: 0.85, floatSpeed: 1.0 },
  { label: 'Cv',  color: '#00C4CC', position: [ 1.5, -0.3,  0.3 ], rotation: [0, -0.3, -0.1], size: 0.8,  floatSpeed: 1.35 },
  { label: 'M',   color: '#C01818', position: [ 2.4, -1.3, -0.1 ], rotation: [0, -0.45, 0.05], size: 0.82, floatSpeed: 0.95 },
]

// ── Phone mesh ──────────────────────────────────────────────────────────────

function Phone() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    // Idle sway
    group.current.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.05
    group.current.position.y = Math.sin(t * 0.8) * 0.06
  })

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0.04, -0.35, 0.02]}>
      {/* Body */}
      <RoundedBox args={[1.7, 3.3, 0.25]} radius={0.18} smoothness={6} castShadow>
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      {/* Bezel */}
      <RoundedBox args={[1.55, 3.15, 0.26]} radius={0.15} smoothness={6} position={[0, 0, 0.001]}>
        <meshStandardMaterial color="#050505" metalness={0.3} roughness={0.4} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, 0.14]}>
        <planeGeometry args={[1.45, 3.05]} />
        <meshStandardMaterial
          color="#003d1e"
          emissive="#22C55E"
          emissiveIntensity={0.6}
          metalness={0}
          roughness={0.2}
        />
      </mesh>
      {/* AK mark on screen */}
      <Text
        position={[0, -0.1, 0.18]}
        fontSize={0.7}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        AK
      </Text>
      {/* Notch */}
      <RoundedBox args={[0.55, 0.12, 0.03]} radius={0.06} smoothness={4} position={[0, 1.45, 0.15]}>
        <meshStandardMaterial color="#000" />
      </RoundedBox>
    </group>
  )
}

// ── Tile mesh ───────────────────────────────────────────────────────────────

function TileMesh({ tile }: { tile: Tile }) {
  const size = tile.size ?? 0.85
  return (
    <Float
      speed={tile.floatSpeed ?? 1.2}
      rotationIntensity={0.15}
      floatIntensity={0.35}
    >
      <group position={tile.position} rotation={tile.rotation ?? [0, 0, 0]}>
        <RoundedBox args={[size, size, 0.18]} radius={0.14} smoothness={5} castShadow>
          <meshStandardMaterial color={tile.color} metalness={0.15} roughness={0.35} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.11]}
          fontSize={size * 0.45}
          color={tile.fg ?? '#ffffff'}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/manrope/v15/xn7gYHE44ni1AdIRggexSg.woff"
          fontWeight="bold"
        >
          {tile.label}
        </Text>
      </group>
    </Float>
  )
}

// ── Shopping bag (right-side static prop) ───────────────────────────────────

function ShoppingBag() {
  return (
    <group position={[3.6, 0.2, -0.4]} rotation={[0.05, -0.25, 0]}>
      <RoundedBox args={[1.3, 1.7, 0.6]} radius={0.1} smoothness={4} castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.6} />
      </RoundedBox>
      {/* Handles */}
      <mesh position={[-0.28, 1.1, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      <mesh position={[0.28, 1.1, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      {/* AK on bag */}
      <Text
        position={[0, 0, 0.32]}
        fontSize={0.45}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        AK
      </Text>
    </group>
  )
}

// ── Fallback (font load) ────────────────────────────────────────────────────

function SceneContents() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#22C55E" />
      <pointLight position={[0, 0, 2]} intensity={0.4} color="#84fab0" />

      <Phone />

      {TILES.map((t) => (
        <TileMesh key={t.label} tile={t} />
      ))}

      <ShoppingBag />

      {/* Soft floor shadow */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.55}
        scale={12}
        blur={3}
        far={4}
        color="#000000"
      />
    </>
  )
}

// ── Public component ────────────────────────────────────────────────────────

export default function HeroScene3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 7], fov: 40 }}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  )
}
