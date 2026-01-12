import React, { Suspense, useRef, useState } from 'react';

// Check if 3D libraries are available at module level
let librariesAvailable = false;
let Canvas, OrbitControls, Environment, PerspectiveCamera, useFrame, useGLTF;

// Stub hooks that do nothing - ensures hooks are always available
const stubUseFrame = () => {};
const stubUseGLTF = () => ({ scene: null });

try {
  const r3f = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  
  Canvas = r3f.Canvas;
  useFrame = r3f.useFrame;
  OrbitControls = drei.OrbitControls;
  Environment = drei.Environment;
  PerspectiveCamera = drei.PerspectiveCamera;
  useGLTF = drei.useGLTF;
  librariesAvailable = true;
} catch (e) {
  console.warn('3D libraries not installed. Please run: npm install three @react-three/fiber @react-three/drei --legacy-peer-deps');
  // Use stubs when libraries aren't available
  useFrame = stubUseFrame;
  useGLTF = stubUseGLTF;
}

// Loading fallback
function LoadingFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0c213a 0%, #1a3452 100%)',
      color: '#fff',
      fontSize: '14px'
    }}>
      Loading 3D Model...
    </div>
  );
}

// Simple car model using primitives - hooks always called
// Based on Three.js car modeling best practices
function SimpleCar({ rotation }) {
  const groupRef = useRef();
  
  // Always call useFrame - it's either real or a stub
  useFrame(() => {
    if (groupRef.current && librariesAvailable) {
      groupRef.current.rotation.y = rotation;
    }
  });

  // Don't render if libraries aren't available
  if (!librariesAvailable) return null;
  
  // Car dimensions - realistic proportions
  const carLength = 4.5;
  const carWidth = 1.8;
  const carHeight = 1.4;
  const wheelRadius = 0.35;
  const wheelWidth = 0.25;

  return (
    <group ref={groupRef}>
      {/* Lower chassis - base of the car */}
      <mesh position={[0, wheelRadius, 0]} castShadow receiveShadow>
        <boxGeometry args={[carLength, 0.3, carWidth]} />
        <meshStandardMaterial color="#0c213a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Main body - streamlined shape */}
      <mesh position={[0, wheelRadius + 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[carLength * 0.85, 0.5, carWidth * 0.9]} />
        <meshStandardMaterial color="#0c213a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Hood section - front */}
      <mesh position={[carLength * 0.3, wheelRadius + 0.5, 0]} rotation={[0, 0, -0.15]} castShadow receiveShadow>
        <boxGeometry args={[carLength * 0.4, 0.3, carWidth * 0.88]} />
        <meshStandardMaterial color="#0c213a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Trunk section - rear */}
      <mesh position={[-carLength * 0.3, wheelRadius + 0.5, 0]} rotation={[0, 0, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[carLength * 0.4, 0.3, carWidth * 0.88]} />
        <meshStandardMaterial color="#0c213a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cabin - passenger area */}
      <mesh position={[0, wheelRadius + 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[carLength * 0.5, 0.6, carWidth * 0.85]} />
        <meshStandardMaterial color="#0c213a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, wheelRadius + 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[carLength * 0.4, 0.2, carWidth * 0.8]} />
        <meshStandardMaterial color="#1a3452" metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Front Windshield */}
      <mesh position={[carLength * 0.15, wheelRadius + 1.05, carWidth * 0.4]} rotation={[-0.6, 0, 0]} castShadow>
        <boxGeometry args={[carLength * 0.35, 0.5, 0.02]} />
        <meshStandardMaterial color="#a0d0ff" opacity={0.85} transparent />
      </mesh>
      
      {/* Rear Windshield */}
      <mesh position={[-carLength * 0.15, wheelRadius + 1.05, -carWidth * 0.4]} rotation={[0.6, 0, 0]} castShadow>
        <boxGeometry args={[carLength * 0.35, 0.5, 0.02]} />
        <meshStandardMaterial color="#a0d0ff" opacity={0.85} transparent />
      </mesh>
      
      {/* Side Windows */}
      <mesh position={[-carWidth * 0.45, wheelRadius + 1.05, carWidth * 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[carLength * 0.4, 0.5, 0.02]} />
        <meshStandardMaterial color="#a0d0ff" opacity={0.8} transparent />
      </mesh>
      <mesh position={[carWidth * 0.45, wheelRadius + 1.05, carWidth * 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[carLength * 0.4, 0.5, 0.02]} />
        <meshStandardMaterial color="#a0d0ff" opacity={0.8} transparent />
      </mesh>
      
      {/* Wheels - positioned at corners */}
      {[
        { x: -carLength * 0.35, z: carWidth * 0.4 },
        { x: carLength * 0.35, z: carWidth * 0.4 },
        { x: -carLength * 0.35, z: -carWidth * 0.4 },
        { x: carLength * 0.35, z: -carWidth * 0.4 }
      ].map((pos, i) => (
        <group key={i} position={[pos.x, wheelRadius, pos.z]}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={1} />
          </mesh>
          {/* Rim */}
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius * 0.75, wheelRadius * 0.75, wheelWidth * 0.5, 32]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Hub */}
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[wheelRadius * 0.4, wheelRadius * 0.4, wheelWidth * 0.3, 16]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
      
      {/* Front Headlights */}
      <mesh position={[-carWidth * 0.35, wheelRadius + 0.3, carLength * 0.45]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[carWidth * 0.35, wheelRadius + 0.3, carLength * 0.45]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={2.5} />
      </mesh>
      
      {/* Front Grille */}
      <mesh position={[0, wheelRadius + 0.25, carLength * 0.46]} castShadow>
        <boxGeometry args={[carWidth * 0.5, 0.25, 0.05]} />
        <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Front Bumper */}
      <mesh position={[0, wheelRadius + 0.15, carLength * 0.5]} castShadow>
        <boxGeometry args={[carLength, 0.2, 0.18]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-carWidth * 0.35, wheelRadius + 0.3, -carLength * 0.45]} castShadow>
        <boxGeometry args={[0.35, 0.3, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[carWidth * 0.35, wheelRadius + 0.3, -carLength * 0.45]} castShadow>
        <boxGeometry args={[0.35, 0.3, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1.5} />
      </mesh>
      
      {/* Rear Bumper */}
      <mesh position={[0, wheelRadius + 0.15, -carLength * 0.5]} castShadow>
        <boxGeometry args={[carLength, 0.2, 0.18]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Side Mirrors */}
      <mesh position={[-carWidth * 0.5, wheelRadius + 0.7, carWidth * 0.3]} rotation={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.2]} />
        <meshStandardMaterial color="#0c213a" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[carWidth * 0.5, wheelRadius + 0.7, carWidth * 0.3]} rotation={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.2]} />
        <meshStandardMaterial color="#0c213a" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  );
}

// GLTF Model loader - hooks always called
// Based on R3F-in-practice: https://github.com/Domenicobrz/R3F-in-practice
function CarModel({ modelPath, rotation }) {
  const modelRef = useRef();
  
  // Always call hooks - useGLTF is either real or a stub
  // Default path matches the reference project structure: /models/car/scene.gltf
  const { scene } = useGLTF(modelPath || '/models/car/scene.gltf');
  
  useFrame(() => {
    if (modelRef.current && librariesAvailable && scene) {
      modelRef.current.rotation.y = rotation;
    }
  });

  // Don't render if libraries aren't available or no scene
  if (!librariesAvailable || !scene) return null;

  // Use primitive to render the loaded GLTF scene (as per R3F-in-practice)
  return <primitive object={scene} ref={modelRef} scale={1} />;
}

// Main 3D Scene - hooks always called
function Scene({ useModel = false, modelPath = null }) {
  const [rotation, setRotation] = useState(0);
  const autoRotateRef = useRef(true);

  // Always call useFrame - it's either real or a stub
  useFrame((state, delta) => {
    if (autoRotateRef.current && librariesAvailable) {
      setRotation(prev => prev + delta * 0.5);
    }
  });

  // Don't render if libraries aren't available
  if (!librariesAvailable) return null;

  return (
    <>
      {/* Lighting setup - similar to R3F-in-practice reference */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Load GLTF model if useModel is true, otherwise use simple car */}
      {useModel ? (
        <Suspense fallback={null}>
          <CarModel modelPath={modelPath} rotation={rotation} />
        </Suspense>
      ) : (
        <SimpleCar rotation={rotation} />
      )}
      
      {/* OrbitControls for interaction - as per R3F-in-practice */}
      {OrbitControls && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={autoRotateRef.current}
          autoRotateSpeed={0.5}
          onStart={() => { autoRotateRef.current = false; }}
        />
      )}
      
      {/* Environment for better lighting */}
      {Environment && <Environment preset="sunset" />}
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </>
  );
}

// 3D Canvas Wrapper - only renders when libraries are available
function Viewer3D({ useModel, modelPath }) {
  if (!librariesAvailable || !Canvas) {
    return null;
  }

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {PerspectiveCamera && <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />}
      <Suspense fallback={<LoadingFallback />}>
        <Scene useModel={useModel} modelPath={modelPath} />
      </Suspense>
    </Canvas>
  );
}

// Main Component
export default function Car3DViewer({ 
  height = '400px', 
  useModel = false, 
  modelPath = null,
  className = '' 
}) {
  // Fallback if libraries aren't available
  if (!librariesAvailable) {
    return (
      <div 
        className={`car-3d-viewer ${className}`}
        style={{
          width: '100%',
          height: height,
          position: 'relative',
          background: 'linear-gradient(135deg, #0c213a 0%, #1a3452 100%)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(15, 15, 15, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#fff',
          padding: '20px'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
          3D Car Viewer
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8, textAlign: 'center', maxWidth: '300px' }}>
          Installing 3D libraries... Please run: 
          <br />
          <code style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '8px',
            display: 'inline-block'
          }}>
            npm install three @react-three/fiber @react-three/drei --legacy-peer-deps
          </code>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`car-3d-viewer ${className}`}
      style={{
        width: '100%',
        height: height,
        position: 'relative',
        background: 'linear-gradient(135deg, #0c213a 0%, #1a3452 100%)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(15, 15, 15, 0.2)'
      }}
    >
      <Viewer3D useModel={useModel} modelPath={modelPath} />
      
      {/* Instructions overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '20px',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 500,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        🖱️ Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
