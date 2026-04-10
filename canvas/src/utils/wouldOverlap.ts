export function wouldOverlap(nextX: number, nextY: number, self: HTMLDivElement) {
  const width = self.offsetWidth;
  const height = self.offsetHeight;
  const modules = document.querySelectorAll<HTMLDivElement>('[data-patch-module="true"]');

  for (const other of modules) {
    if (other === self) {
      continue;
    }

    const otherLeft = Number.parseFloat(other.style.left || "0") || other.offsetLeft;
    const otherTop = Number.parseFloat(other.style.top || "0") || other.offsetTop;
    const otherRight = otherLeft + other.offsetWidth;
    const otherBottom = otherTop + other.offsetHeight;

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
