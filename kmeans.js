// Simple 1D K-means on percentages to group students by performance
function kMeans1D(percentages, k = 3, maxIterations = 100) {
  if (!percentages.length) return { centroids: [], assignments: [] };

  // initialize centroids evenly between min and max
  const min = Math.min(...percentages);
  const max = Math.max(...percentages);
  const centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(min + ((max - min) * i) / (k - 1 || 1));
  }

  let assignments = new Array(percentages.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    // assign
    let changed = false;
    for (let i = 0; i < percentages.length; i++) {
      const p = percentages[i];
      let bestIdx = 0;
      let bestDist = Infinity;
      centroids.forEach((c, idx) => {
        const d = Math.abs(p - c);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = idx;
        }
      });
      if (assignments[i] !== bestIdx) {
        assignments[i] = bestIdx;
        changed = true;
      }
    }

    // recompute centroids
    const sums = new Array(k).fill(0);
    const counts = new Array(k).fill(0);
    percentages.forEach((p, i) => {
      const c = assignments[i];
      sums[c] += p;
      counts[c] += 1;
    });
    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) centroids[i] = sums[i] / counts[i];
    }

    if (!changed) break;
  }

  return { centroids, assignments };
}

module.exports = { kMeans1D };


