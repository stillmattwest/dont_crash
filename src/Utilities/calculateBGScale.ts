export const calculateBgScale = (
  bgWidth: number,
  bgHeight: number,
  sceneWidth: number,
  sceneHeight: number
): number => {
  const scaleX = sceneWidth / bgWidth;
  const scaleY = sceneHeight / bgHeight;
  // apply the larger scale factor to maintain aspect ratio
  const scale = Math.max(scaleX, scaleY);
  return scale;
};
