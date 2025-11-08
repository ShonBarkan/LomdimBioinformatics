import React, { useState, useEffect } from "react";
import { Card, Button, Space } from "antd";
import { CheckOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";

const QuizComponent = ({ subjectTrivia }) => {
  const [answers, setAnswers] = useState({});
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Function to shuffle answers
  const shuffleAnswers = () => {
    const newShuffled = subjectTrivia.map(q => ({
      ...q,
      shuffledAnswers: [...q.answers].sort(() => Math.random() - 0.5)
    }));
    setShuffledAnswers(newShuffled);
  };

  // Initialize shuffled answers
  useEffect(() => {
    shuffleAnswers();
  }, [subjectTrivia]);

    const handleAnswer = (questionIndex, answer, correctAnswer) => {
    if (answers[questionIndex]?.isCorrect) return; // Only prevent if correctAnswer was given
    const isCorrect = answer === correctAnswer;
    setAnswers((prev) => ({
        ...prev,
        [questionIndex]: { selected: answer, isCorrect },
    }));
    };

  const resetQuiz = () => {
    setAnswers({});
    shuffleAnswers();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <Button 
        onClick={resetQuiz}
        icon={<RedoOutlined />}
        className="mb-4"
      >
        Reset Quiz
      </Button>

        {shuffledAnswers.map((q, index) => {
        const userAnswer = answers[index];
        const isCorrect = userAnswer?.isCorrect;
        const cardBorder = isCorrect ? "border-green-500" : "border-gray-200";

        return (
          <Card
            key={index}
            title={`שאלה ${index + 1}`}
            className={`w-full max-w-2xl border-2 ${cardBorder} shadow-md`}
          >
            <p className="text-lg font-medium mb-4">{q.question}</p>
            
            {/* Show explanation after correctAnswer */}
            {userAnswer?.isCorrect && (
              <p className="text-green-600 mb-4 p-3 bg-green-50 rounded">
                {q.explanation}
              </p>
            )}

            <Space direction="vertical" className="w-full">
                {q.shuffledAnswers.map((ans, i) => {
                const selected = userAnswer?.selected === ans;
                const isThisCorrect = q["correctAnswer"] === ans;

                let btnClass =
                    "w-full text-right rounded-lg font-medium transition-all";
                if (selected && userAnswer?.isCorrect)
                    btnClass += " bg-green-500 text-white border-green-600";
                else if (selected && !userAnswer?.isCorrect)
                    btnClass += " bg-red-500 text-white border-red-600";
                else btnClass += " bg-white border-gray-300 hover:bg-gray-50";

                return (
                    <Button
                    key={i}
                    onClick={() => handleAnswer(index, ans, q["correctAnswer"])}
                    disabled={selected || userAnswer?.isCorrect} // Only disable if this answer was selected or correctAnswer found
                    className={btnClass}
                    icon={
                        selected ? (
                        userAnswer?.isCorrect ? (
                            <CheckOutlined />
                        ) : (
                            <CloseOutlined />
                        )
                        ) : null
                    }
                    >
                    {ans}
                    </Button>
                );
                })}
            </Space>
          </Card>
        );
      })}
    </div>
  );
};

export default QuizComponent;