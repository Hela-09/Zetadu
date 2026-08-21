const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// 1. Add correctAnswer?: any to Question interface
code = code.replace(
  "correctAnswerIndex: number;",
  "correctAnswerIndex?: number;\n  correctAnswer?: any;"
);

// 2. Add helper function isOptionCorrect right inside Practice component
const helperFunc = `
  const isOptionCorrect = (question: any, index: number | null) => {
    if (index === null) return false;
    let correctValue = question.correctAnswerIndex !== undefined ? question.correctAnswerIndex : question.correctAnswer;
    if (correctValue === undefined) return false;

    if (typeof correctValue === 'number') {
      return correctValue === index;
    }
    if (typeof correctValue === 'string') {
      const normalizedStr = correctValue.trim().toLowerCase();
      if (['a', 'b', 'c', 'd'].includes(normalizedStr)) {
        if (normalizedStr.charCodeAt(0) - 97 === index) return true;
      }
      if (question.options && question.options[index] && question.options[index].trim().toLowerCase() === normalizedStr) {
        return true;
      }
      if (!isNaN(Number(normalizedStr))) {
         return Number(normalizedStr) === index;
      }
    }
    return false;
  };
`;

code = code.replace(
  "export default function Practice() {\n  const { user, getToken, settings, userProfile } = useAuth();",
  "export default function Practice() {\n  const { user, getToken, settings, userProfile } = useAuth();" + helperFunc
);

// 3. Fix handleSubmit to prevent double scoring
code = code.replace(
  "  const handleSubmit = () => {\n    if (selectedOption !== null) {\n      setIsSubmitted(true);\n      if (selectedOption === questions[currentQIndex].correctAnswerIndex) {\n        setScore(prev => prev + 1);\n      }\n    }\n  };",
  "  const handleSubmit = () => {\n    if (selectedOption !== null && !isSubmitted) {\n      setIsSubmitted(true);\n      if (isOptionCorrect(questions[currentQIndex], selectedOption)) {\n        setScore(prev => prev + 1);\n      }\n    }\n  };"
);

// 4. Fix confirmEndPractice double scoring
code = code.replace(
  "score: score + (isSubmitted && selectedOption === questions[currentQIndex]?.correctAnswerIndex ? 1 : 0),",
  "score: score,"
);

// 5. Fix handleNext double scoring
code = code.replace(
  "score: score + (selectedOption === questions[currentQIndex].correctAnswerIndex ? 1 : 0),",
  "score: score,"
);

code = code.replace(
  "alert(`Practice session complete! You scored ${score + (selectedOption === questions[currentQIndex].correctAnswerIndex ? 1 : 0)} out of ${questions.length}.`);",
  "alert(`Practice session complete! You scored ${score} out of ${questions.length}.`);"
);

// 6. Update rendering logic
code = code.replace(
  "const isCorrect = isSubmitted && index === question.correctAnswerIndex;",
  "const isCorrect = isSubmitted && isOptionCorrect(question, index);"
);

code = code.replace(
  "const isWrongSelection = isSubmitted && isSelected && index !== question.correctAnswerIndex;",
  "const isWrongSelection = isSubmitted && isSelected && !isOptionCorrect(question, index);"
);

code = code.replace(
  "selectedOption === question.correctAnswerIndex \n                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' \n                    : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'",
  "isOptionCorrect(question, selectedOption) \n                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30' \n                    : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30'"
);

code = code.replace(
  "selectedOption === question.correctAnswerIndex ? 'text-emerald-500' : 'text-amber-500'",
  "isOptionCorrect(question, selectedOption) ? 'text-emerald-500' : 'text-amber-500'"
);

code = code.replace(
  "selectedOption === question.correctAnswerIndex ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'",
  "isOptionCorrect(question, selectedOption) ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'"
);

code = code.replace(
  "selectedOption === question.correctAnswerIndex ? 'Correct!' : 'Incorrect'",
  "isOptionCorrect(question, selectedOption) ? 'Correct!' : 'Incorrect'"
);

// 7. Make correct answer always highlighted even if not selected
// The logic currently uses isCorrect for the option styling, which applies to any correct option, regardless of selection.
// wait, styleClass logic:
// if (isSelected && !isSubmitted) { ... }
// else if (isCorrect) { ... } // <--- this applies to the correct option, selected or not.
// else if (isWrongSelection) { ... } // <--- this applies to the wrong option that was selected.
// This is exactly what the prompt asked for: "Correct answer when the user selected incorrectly: - Still clearly highlighted so the student knows the correct answer."
// This means the styleClass logic is already correct! It just wasn't triggering because correctAnswerIndex was undefined.

fs.writeFileSync('src/components/Practice.tsx', code);
