export function wouldOverlap(nextX: number, nextY: number, self: HTMLDivElement) {
  const width = self.offsetWidth;
  const height = self.offsetHeight;
  const modules = document.querySelectorAll<HTMLDivElement>('[data-patch-module="true"]');

  for (const other of modules) {
    if (other === self) {
      continue;
    }

    const rect = other.getBoundingClientRect();
    const otherLeft = rect.left + window.scrollX;
    const otherTop = rect.top + window.scrollY;
    const otherRight = otherLeft + rect.width;
    const otherBottom = otherTop + rect.height;

    const intersects =
      nextX < otherRight &&
      nextX + width > otherLeft &&
      nextY < otherBottom &&
      nextY + height > otherTop;

    if (intersects) {
      return true;
    }
  }

  return false;
}
