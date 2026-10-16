import type { Scene } from '../types/index.ts';

export function padZero(num: number, size: number = 2): string {
  let s = Math.floor(num).toString();
  while (s.length < size) s = '0' + s;
  return s;
}

export function formatTimestampSRT(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)},${padZero(millis, 3)}`;
}

export function formatTimestampVTT(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 1000);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(millis, 3)}`;
}

export function calculateTotalDuration(scenes: Scene[]): number {
  return scenes.reduce((acc, scene) => acc + (scene.durationSeconds || 5), 0);
}

export function generateSRT(scenes: Scene[]): string {
  let currentTime = 0;
  const blocks: string[] = [];

  scenes.forEach((scene, index) => {
    const startTime = currentTime;
    const duration = scene.durationSeconds > 0 ? scene.durationSeconds : 5;
    const endTime = startTime + duration;
    currentTime = endTime;

    const text = scene.narrationText || scene.onScreenText || scene.title;
    blocks.push(
      `${index + 1}\n${formatTimestampSRT(startTime)} --> ${formatTimestampSRT(endTime)}\n${text.trim()}\n`
    );
  });

  return blocks.join('\n');
}

export function generateWebVTT(scenes: Scene[]): string {
  let currentTime = 0;
  const lines: string[] = ['WEBVTT\n'];

  scenes.forEach((scene, index) => {
    const startTime = currentTime;
    const duration = scene.durationSeconds > 0 ? scene.durationSeconds : 5;
    const endTime = startTime + duration;
    currentTime = endTime;

    const text = scene.narrationText || scene.onScreenText || scene.title;
    lines.push(
      `${index + 1}\n${formatTimestampVTT(startTime)} --> ${formatTimestampVTT(endTime)}\n${text.trim()}\n`
    );
  });

  return lines.join('\n');
}

export function generateTranscript(scenes: Scene[], targetLangName: string): string {
  const totalDuration = calculateTotalDuration(scenes);
  const lines: string[] = [
    `GuideFlow AI — Guidance Video Transcript`,
    `Target Language: ${targetLangName}`,
    `Total Duration: ${Math.round(totalDuration)} seconds (${scenes.length} scenes)`,
    `Generated: ${new Date().toISOString()}`,
    `--------------------------------------------------\n`
  ];

  let currentTime = 0;
  scenes.forEach((scene) => {
    const start = Math.floor(currentTime);
    const duration = scene.durationSeconds || 5;
    const end = Math.floor(currentTime + duration);
    currentTime += duration;

    lines.push(`[${padZero(Math.floor(start / 60))}:${padZero(start % 60)} - ${padZero(Math.floor(end / 60))}:${padZero(end % 60)}] Scene ${scene.sceneNumber}: ${scene.title}`);
    lines.push(`Narration: ${scene.narrationText}`);
    if (scene.onScreenText) {
      lines.push(`On-screen text: ${scene.onScreenText}`);
    }
    if (scene.keyHighlight) {
      lines.push(`Key takeaway: ${scene.keyHighlight}`);
    }
    lines.push('');
  });

  return lines.join('\n');
}
