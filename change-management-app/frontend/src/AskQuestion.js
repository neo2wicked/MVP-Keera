import React, { useState } from 'react';

function AskQuestion() {
  const [questions, setQuestions] = useState(['', '']);
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting questions:', questions);
    try {
      const response = await fetch('http://localhost:5001/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit questions');
      }
      const data = await response.json();
      console.log('Questions submitted successfully:', data);
      setCode(data.code); // Set the code to display it on the screen
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <input
            key={index}
            type="text"
            value={question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            placeholder={`Ask question ${index + 1}...`}
          />
        ))}
        <button type="submit">Submit Questions</button>
      </form>
      {code && (
        <div>
          <p>Share this code with the interviewee: <strong>{code}</strong></p>
        </div>
      )}
    </div>
  );
}

export default AskQuestion;