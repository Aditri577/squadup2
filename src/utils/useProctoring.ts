import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

// ---------------------------------------------------------------------------
// Violation kinds
// ---------------------------------------------------------------------------
export type ProctorViolationKind =
  | 'CAMERA_OFF'
  | 'MIC_MUTED'
  | 'FACE_LOOK_AWAY'
  | 'VOICE_DISCUSSION_DETECTED'
  | 'DEVTOOLS_ATTEMPT';

// ---------------------------------------------------------------------------
// Hook options
// ---------------------------------------------------------------------------
interface UseProctoringOptions {
  active: boolean;
  onViolation: (kind: ProctorViolationKind, message: string) => void;
}

// ---------------------------------------------------------------------------
// Face-tracking status
// ---------------------------------------------------------------------------
export type FaceStatus = 'locked' | 'away' | 'unknown';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isTrackLive = (track: MediaStreamTrack | null | undefined) =>
  !!track && track.readyState === 'live' && track.enabled && !track.muted;

const FAIL_THRESHOLD = 2;

/**
 * Compute mean pixel brightness (0–255) for a rectangular region of an
 * ImageData object.  Uses the luminance formula: 0.299R + 0.587G + 0.114B.
 */
function regionBrightness(
  data: Uint8ClampedArray,
  fullW: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
): number {
  let sum = 0;
  let count = 0;
  for (let row = y0; row < y0 + h; row++) {
    for (let col = x0; col < x0 + w; col++) {
      const idx = (row * fullW + col) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      sum += 0.299 * r + 0.587 * g + 0.114 * b;
      count++;
    }
  }
  return count === 0 ? 0 : sum / count;
}

// ---------------------------------------------------------------------------
// useFaceTracking
// ---------------------------------------------------------------------------
/**
 * Lightweight canvas-based face / gaze presence detector.
 *
 * Strategy:
 *  - Every 2 s draw the current video frame to an offscreen canvas.
 *  - Measure brightness in three regions:
 *      • Central 50 % — proxy for face presence
 *      • Top-centre 25 % — forehead / upper area
 *      • Bottom-centre 25 % — chin / lower area
 *  - Calibrate a baseline brightness on the first valid frame.
 *  - Fire `FACE_LOOK_AWAY` if:
 *      a) Central brightness < 15  (very dark → face gone / covered), OR
 *      b) Central brightness dropped > 40 pts from baseline, OR
 *      c) Top-centre brightness is significantly higher than bottom-centre
 *         (face shifted upward / looking away).
 *  - Require 2 consecutive suspicious frames before firing (ignores single
 *    glitches).
 */
export function useFaceTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean,
  onViolation: (kind: ProctorViolationKind, message: string) => void,
): { faceStatus: FaceStatus } {
  const [faceStatus, setFaceStatus] = useState<FaceStatus>('unknown');

  const baselineBrightness = useRef<number | null>(null);
  const consecutiveAway = useRef(0);
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setFaceStatus('unknown');
      baselineBrightness.current = null;
      consecutiveAway.current = 0;
      firedRef.current = false;
      return;
    }

    const INTERVAL_MS = 2000;
    // How many brightness-drop points triggers an alert
    const DROP_THRESHOLD = 40;
    // Minimum central brightness — below this, face is considered gone
    const DARK_THRESHOLD = 15;
    // Upward gaze: top region brighter than bottom by this many points
    const GAZE_UP_THRESHOLD = 35;

    const id = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const W = video.videoWidth || 320;
      const H = video.videoHeight || 240;
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, W, H);
      let imageData: ImageData;
      try {
        imageData = ctx.getImageData(0, 0, W, H);
      } catch {
        // Cross-origin or security error — bail out silently
        return;
      }

      const { data } = imageData;

      // Central 50 % region
      const cx0 = Math.floor(W * 0.25);
      const cy0 = Math.floor(H * 0.25);
      const cw = Math.floor(W * 0.5);
      const ch = Math.floor(H * 0.5);
      const centralBrightness = regionBrightness(data, W, cx0, cy0, cw, ch);

      // Top-centre: top 25 % of height, middle 50 % of width
      const topBrightness = regionBrightness(
        data,
        W,
        cx0,
        0,
        cw,
        Math.floor(H * 0.25),
      );

      // Bottom-centre: bottom 25 % of height, middle 50 % of width
      const botBrightness = regionBrightness(
        data,
        W,
        cx0,
        Math.floor(H * 0.75),
        cw,
        Math.floor(H * 0.25),
      );

      // Calibrate baseline on first valid (non-dark) frame
      if (baselineBrightness.current === null && centralBrightness > DARK_THRESHOLD) {
        baselineBrightness.current = centralBrightness;
      }

      const baseline = baselineBrightness.current ?? centralBrightness;

      const isDark = centralBrightness < DARK_THRESHOLD;
      const isDrop = centralBrightness < baseline - DROP_THRESHOLD;
      const isGazeUp = topBrightness - botBrightness > GAZE_UP_THRESHOLD;

      const away = isDark || isDrop || isGazeUp;

      if (away) {
        consecutiveAway.current += 1;
      } else {
        consecutiveAway.current = 0;
        firedRef.current = false;
        setFaceStatus('locked');
      }

      // Require 2+ consecutive suspicious frames before firing
      if (consecutiveAway.current >= 2) {
        setFaceStatus('away');
        if (!firedRef.current) {
          firedRef.current = true;
          onViolationRef.current(
            'FACE_LOOK_AWAY',
            'Face not detected or gaze away from screen during the proctored session!',
          );
        }
      }
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(id);
    };
  }, [active, videoRef, canvasRef]);

  return { faceStatus };
}

// ---------------------------------------------------------------------------
// useProctoring (main hook)
// ---------------------------------------------------------------------------
export function useProctoring({ active, onViolation }: UseProctoringOptions) {
  // ── Media stream state ────────────────────────────────────────────────────
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // ── Audio analysis state ──────────────────────────────────────────────────
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceDetected, setVoiceDetected] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const streamRef = useRef<MediaStream | null>(null);
  const cameraFails = useRef(0);
  const micFails = useRef(0);
  const cameraFired = useRef(false);
  const micFired = useRef(false);
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  // Audio refs — kept across renders without triggering re-renders
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const voiceSustainStart = useRef<number | null>(null);
  const voiceFiredRef = useRef(false);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Tear down the Web Audio pipeline. */
  const cleanupAudio = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    voiceSustainStart.current = null;
    voiceFiredRef.current = false;
    setAudioLevel(0);
    setVoiceDetected(false);
  }, []);

  // ── stop ──────────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    cameraFails.current = 0;
    micFails.current = 0;
    cameraFired.current = false;
    micFired.current = false;
    cleanupAudio();
    setStream(null);
    setCameraOn(false);
    setMicOn(false);
  }, [cleanupAudio]);

  // ── start ─────────────────────────────────────────────────────────────────
  const start = useCallback(async (): Promise<boolean> => {
    setPermissionError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = media;
      cameraFails.current = 0;
      micFails.current = 0;
      cameraFired.current = false;
      micFired.current = false;
      setStream(media);
      setCameraOn(isTrackLive(media.getVideoTracks()[0]));
      setMicOn(isTrackLive(media.getAudioTracks()[0]));
      return true;
    } catch {
      stop();
      setPermissionError(
        'Camera & microphone access is required for the proctored session. Allow access in your browser, then start again.',
      );
      return false;
    }
  }, [stop]);

  // ── Camera / mic liveness polling ─────────────────────────────────────────
  useEffect(() => {
    if (!active || !stream) return;

    const video = stream.getVideoTracks()[0] || null;
    const audio = stream.getAudioTracks()[0] || null;

    const check = () => {
      // Camera check
      const camLive = isTrackLive(video);
      setCameraOn(camLive);
      if (camLive) {
        cameraFails.current = 0;
        cameraFired.current = false;
      } else {
        cameraFails.current += 1;
        if (cameraFails.current >= FAIL_THRESHOLD && !cameraFired.current) {
          cameraFired.current = true;
          onViolationRef.current(
            'CAMERA_OFF',
            'Camera feed lost or disabled during the proctored session!',
          );
        }
      }

      // Mic check
      const micLive = isTrackLive(audio);
      setMicOn(micLive);
      if (micLive) {
        micFails.current = 0;
        micFired.current = false;
      } else {
        micFails.current += 1;
        if (micFails.current >= FAIL_THRESHOLD && !micFired.current) {
          micFired.current = true;
          onViolationRef.current(
            'MIC_MUTED',
            'Microphone muted or disconnected during the proctored session!',
          );
        }
      }
    };

    const tracks = [video, audio].filter((t): t is MediaStreamTrack => !!t);
    tracks.forEach(track => {
      track.addEventListener('mute', check);
      track.addEventListener('unmute', check);
      track.addEventListener('ended', check);
    });
    const interval = window.setInterval(check, 1500);

    return () => {
      window.clearInterval(interval);
      tracks.forEach(track => {
        track.removeEventListener('mute', check);
        track.removeEventListener('unmute', check);
        track.removeEventListener('ended', check);
      });
    };
  }, [active, stream]);

  // ── Voice / discussion detection via Web Audio API ────────────────────────
  useEffect(() => {
    if (!active || !stream) {
      cleanupAudio();
      return;
    }

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    // Build audio pipeline: MediaStream → AnalyserNode
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
    } catch {
      // AudioContext not available (e.g. in tests/SSR)
      return;
    }
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const source = ctx.createMediaStreamSource(new MediaStream([audioTrack]));
    source.connect(analyser);

    const bufferLength = analyser.fftSize;
    const timeDomainData = new Float32Array(bufferLength);

    // Thresholds
    const RMS_THRESHOLD = 0.035;      // Speech detection threshold
    const SUSTAINED_MS = 2000;        // Must be above threshold for 2 s to fire
    const POLL_INTERVAL_MS = 250;     // Check every 250 ms

    const id = window.setInterval(() => {
      if (!analyserRef.current) return;
      analyserRef.current.getFloatTimeDomainData(timeDomainData);

      // Compute RMS
      let sumSq = 0;
      for (let i = 0; i < bufferLength; i++) {
        sumSq += timeDomainData[i] * timeDomainData[i];
      }
      const rms = Math.sqrt(sumSq / bufferLength);

      // Clamp to [0, 1] for the exported level
      setAudioLevel(Math.min(1, rms));

      if (rms > RMS_THRESHOLD) {
        setVoiceDetected(true);
        // Record when sustained voice started
        if (voiceSustainStart.current === null) {
          voiceSustainStart.current = Date.now();
        }
        // Fire violation if sustained past threshold
        const elapsed = Date.now() - voiceSustainStart.current;
        if (elapsed >= SUSTAINED_MS && !voiceFiredRef.current) {
          voiceFiredRef.current = true;
          onViolationRef.current(
            'VOICE_DISCUSSION_DETECTED',
            'Sustained voice/discussion detected during proctored session!',
          );
        }
      } else {
        // Voice dropped below threshold — reset the sustain timer
        setVoiceDetected(false);
        voiceSustainStart.current = null;
        voiceFiredRef.current = false;
      }
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      cleanupAudio();
    };
  }, [active, stream, cleanupAudio]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => stop, [stop]);

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    stream,
    cameraOn,
    micOn,
    permissionError,
    start,
    stop,
    clearPermissionError: () => setPermissionError(null),
    audioLevel,
    voiceDetected,
  };
}
