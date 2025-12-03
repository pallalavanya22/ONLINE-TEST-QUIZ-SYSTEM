function autoGrade(quiz, answersPayload) {
  let score = 0;
  let maxScore = 0;
  const answers = [];

  quiz.questions.forEach((q, index) => {
    const submitted = answersPayload.find((a) => a.questionIndex === index);
    const selectedIndex = submitted ? submitted.selectedIndex : null;
    const correct = selectedIndex === q.correctIndex;
    const marksAwarded = correct ? q.marks : 0;
    score += marksAwarded;
    maxScore += q.marks;
    answers.push({
      questionIndex: index,
      selectedIndex,
      correct,
      marksAwarded
    });
  });

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return { score, maxScore, percentage, answers };
}

module.exports = { autoGrade };


