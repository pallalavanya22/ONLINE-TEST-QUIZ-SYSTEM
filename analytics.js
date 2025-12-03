function computeStats(responses) {
  if (!responses.length) {
    return {
      averageScore: 0,
      averagePercentage: 0,
      attempts: 0,
      maxScore: 0
    };
  }

  const attempts = responses.length;
  let totalScore = 0;
  let totalPercentage = 0;
  let maxScore = responses[0].maxScore || 0;

  responses.forEach((r) => {
    totalScore += r.score;
    totalPercentage += r.percentage;
    if (r.maxScore > maxScore) maxScore = r.maxScore;
  });

  return {
    averageScore: totalScore / attempts,
    averagePercentage: totalPercentage / attempts,
    attempts,
    maxScore
  };
}

module.exports = { computeStats };


