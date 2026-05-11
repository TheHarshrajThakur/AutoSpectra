import React, { useEffect, useRef } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useStore } from '../../store/useStore';

/**
 * HandGestureController Component
 * The core engine for hand tracking. It initializes MediaPipe HandLandmarker,
 * accesses the user's webcam, and processes video frames to calculate palm position and pinch zoom.
 * 
 * Data is pushed to the global Zustand store to be consumed by HandControls.
 */
export default function HandGestureController() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const setHandPosition = useStore((state) => state.setHandPosition);
  const requestRef = useRef();

  useEffect(() => {
    let handLandmarker;
    let videoStream;
    let isRunning = true;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        if (!isRunning) return;

        videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.addEventListener('loadeddata', predictWebcam);
        }
      } catch (err) {
        console.error("Error initializing MediaPipe HandTracking", err);
      }
    };

    let lastVideoTime = -1;
    const predictWebcam = async () => {
      if (!videoRef.current || !handLandmarker) return;

      const startTimeMs = performance.now();
      if (lastVideoTime !== videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          // Use index 9 (Middle Finger MCP) for a stable center point
          const palm = results.landmarks[0][9];
          // Normalize to 0-1 range. Note: X is inverted because webcam is mirrored.
          setHandPosition(1 - palm.x, palm.y);

          // Calculate Pinch to Zoom
          const thumb = results.landmarks[0][4];
          const indexFinger = results.landmarks[0][8];
          const pinchDistance = Math.hypot(thumb.x - indexFinger.x, thumb.y - indexFinger.y);

          // Map typical pinch distance (0.05 - 0.25) to zoom scale (0.5x to 2.5x)
          let mappedZoom = ((pinchDistance - 0.05) / (0.25 - 0.05)) * (2.5 - 0.5) + 0.5;
          mappedZoom = Math.max(0.5, Math.min(2.5, mappedZoom)); // Clamp values

          useStore.getState().setHandZoom(mappedZoom);

          // Optional: Draw landmarks on canvas for debugging/cool factor
          drawLandmarks(results.landmarks[0]);
        }
      }

      if (isRunning) {
        requestRef.current = requestAnimationFrame(predictWebcam);
      }
    };

    const drawLandmarks = (landmarks) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';

      landmarks.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * canvas.width, point.y * canvas.height, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    init();

    return () => {
      isRunning = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (handLandmarker) handLandmarker.close();
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{
      position: 'absolute', bottom: '20px', left: '20px', zIndex: 9999,
      width: '160px', height: '120px', borderRadius: '8px', overflow: 'hidden',
      border: '2px solid rgba(59,130,246,0.5)', background: '#000',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    }}>
      {/* Video element is horizontally mirrored so it feels like a mirror */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        width={160}
        height={120}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }}
      />
      <div style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>
        HAND TRACKING
      </div>
    </div>
  );
}
