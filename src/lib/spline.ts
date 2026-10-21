/**
 * Monotone cubic interpolation (Fritsch–Carlson).
 *
 * Used for the camera track: a piecewise-eased `interpolate` chain has a
 * velocity discontinuity at every keyframe, which reads as a tiny hitch
 * exactly where the whip-pan should feel continuous. A monotone spline through
 * the tracked points keeps the velocity continuous while never overshooting.
 */
export const monotoneCubic = (
  xs: number[],
  ys: number[],
): ((x: number) => number) => {
  const n = xs.length;
  if (n < 2) {
    throw new Error('monotoneCubic needs at least two points');
  }

  const h: number[] = [];
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
    delta[i] = (ys[i + 1] - ys[i]) / h[i];
  }

  const m: number[] = new Array(n).fill(0);
  m[0] = delta[0];
  m[n - 1] = delta[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      m[i] = 0;
    } else {
      m[i] = (delta[i - 1] + delta[i]) / 2;
    }
  }

  // limit the tangents so the curve stays monotone (no overshoot)
  for (let i = 0; i < n - 1; i++) {
    if (delta[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / delta[i];
    const b = m[i + 1] / delta[i];
    const s = Math.hypot(a, b);
    if (s > 3) {
      const t = 3 / s;
      m[i] = t * a * delta[i];
      m[i + 1] = t * b * delta[i];
    }
  }

  return (x: number) => {
    if (x <= xs[0]) {
      return ys[0];
    }
    if (x >= xs[n - 1]) {
      return ys[n - 1];
    }
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) {
      i++;
    }
    const t = (x - xs[i]) / h[i];
    const t2 = t * t;
    const t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return h00 * ys[i] + h10 * h[i] * m[i] + h01 * ys[i + 1] + h11 * h[i] * m[i + 1];
  };
};
