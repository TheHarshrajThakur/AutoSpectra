import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

/**
 * HandControls Component
 * A non-rendering utility that attaches to a Three.js scene.
 * It listens to hand tracking data from the global store and updates the camera/controls.
 * 
 * @param {Object} props.controlsRef - React ref to the OrbitControls instance.
 * @param {string} props.targetId - The unique ID this controller should respond to.
 */
export default function HandControls({ controlsRef, targetId }) {

  useFrame((state) => {
    const { isHandTracking, handControlTarget } = useStore.getState();
    
    // Only process if tracking is ON AND this specific component is the TARGET
    if (isHandTracking && handControlTarget === targetId && controlsRef.current) {
      const pos = useStore.getState().handPosition;
      const zoom = useStore.getState().handZoom;
      
      // Much wider range for full 360 degree rotation on sweeping motions
      const targetAzimuthalAngle = THREE.MathUtils.mapLinear(pos.x, 0, 1, Math.PI, -Math.PI);
      const targetPolarAngle = THREE.MathUtils.mapLinear(pos.y, 0, 1, Math.PI / 8, Math.PI / 1.5);
      
      const currentAzimuthal = controlsRef.current.getAzimuthalAngle();
      const currentPolar = controlsRef.current.getPolarAngle();

      // Increased interpolation factor for much faster, snappier responsiveness
      controlsRef.current.setAzimuthalAngle(THREE.MathUtils.lerp(currentAzimuthal, targetAzimuthalAngle, 0.25));
      controlsRef.current.setPolarAngle(THREE.MathUtils.lerp(currentPolar, targetPolarAngle, 0.25));
      controlsRef.current.update();

      // Handle Zoom
      state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, zoom, 0.15);
      state.camera.updateProjectionMatrix();
    }
  });
  
  return null;
}
