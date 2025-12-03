// Very simple adaptive selection: prefer questions with difficulty ~ targetDifficulty
function selectNextQuestion(quiz, answeredIndices, targetDifficulty = 2) {
  const remaining = quiz.questions
    .map((q, index) => ({ ...q.toObject(), index }))
    .filter((q) => !answeredIndices.includes(q.index));

  if (!remaining.length) return null;

  remaining.sort((a, b) => {
    const da = Math.abs(a.difficulty - targetDifficulty);
    const db = Math.abs(b.difficulty - targetDifficulty);
    return da - db;
  });

  return remaining[0];
}

module.exports = { selectNextQuestion };


