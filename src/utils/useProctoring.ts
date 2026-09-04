import { useCallback, useEffect, useRef, useState } from 'react';

export type ProctorViolationKind = 'CAMERA_OFF' | 'MIC_MUTED';

interface UseProctoringOptions {
  active: boolean;
  onViolation: (kind: ProctorViolationKind, message: string) => void;
}

const isTrackLive = (track: MediaStreamTrack | null | undefined) =>
  !!track && track.readyState === 'live' && track.enabled && !track.muted;

// A device must miss two consecutive health checks before it counts as a violation,
// so a momentary glitch or OS device switch does not end someone's assessment.
const FAIL_THRESHOLD = 2;

// Live presence monitoring only: the stream is rendered to a local self-view and
// never recorded, stored, or uploaded.
export function useProctoring({ active, onViolation }: UseProctoringOptions) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const cameraFails = useRef(0);
  const micFails = useRef(0);
  const cameraFired = useRef(false);
  const micFired = useRef(false);
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    cameraFails.current = 0;
    micFails.current = 0;
    cameraFired.current = false;
    micFired.current = false;
    setStream(null);
    setCameraOn(false);
    setMicOn(false);
  }, []);

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
        'Camera & microphone access is required for the proctored session. Allow access in your browser, then start again.'
      );
      return false;
    }
  }, [stop]);

  useEffect(() => {
    if (!active || !stream) return;

    const video = stream.getVideoTracks()[0] || null;
    const audio = stream.getAudioTracks()[0] || null;

    const check = () => {
      const camLive = isTrackLive(video);
      setCameraOn(camLive);
      if (camLive) {
        cameraFails.current = 0;
        cameraFired.current = false;
      } else {
        cameraFails.current += 1;
        if (cameraFails.current >= FAIL_THRESHOLD && !cameraFired.current) {
          cameraFired.current = true;
          onViolationRef.current('CAMERA_OFF', 'Camera feed lost or disabled during the proctored session!');
        }
      }

      const micLive = isTrackLive(audio);
      setMicOn(micLive);
      if (micLive) {
        micFails.current = 0;
        micFired.current = false;
      } else {
        micFails.current += 1;
        if (micFails.current >= FAIL_THRESHOLD && !micFired.current) {
          micFired.current = true;
          onViolationRef.current('MIC_MUTED', 'Microphone muted or disconnected during the proctored session!');
        }
      }
    };

    const tracks = [video, audio].filter((t): t is MediaStreamTrack => !!t);
    tracks.forEach(track => {
      track.addEventListener('mute', check);
      track.addEventListener('unmute', check);
      track.addEventListener('ended', check);
    });
    // Poll as well: OS-level camera kills do not always fire track events.
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

  useEffect(() => stop, [stop]);

  return { stream, cameraOn, micOn, permissionError, start, stop, clearPermissionError: () => setPermissionError(null) };
}
