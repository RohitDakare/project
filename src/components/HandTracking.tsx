import React, { useRef, useEffect } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { useGameStore } from '../store';

const HandTracking: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setHandPosition } = useGameStore();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks?.[0]) {
        const index = results.multiHandLandmarks[0][8]; // Index finger tip
        setHandPosition({
          x: index.x * 640,
          y: index.y * 480,
        });
      } else {
        setHandPosition(null);
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      hands.close();
      camera.stop();
    };
  }, [setHandPosition]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 mirror-mode"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
};

export default HandTracking;