import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AskQuestion() {
  const [questions, setQuestions] = useState(['', '']);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting questions:', questions);
    try {
      const response = await fetch('http://localhost:5001/api/questions', { // Correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Add this header to avoid preflight requests
        },
        body: JSON.stringify({ questions }),
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        console.error('Failed to save questions:', response.statusText);
        return;
      }
      const data = await response.json();
      console.log('Response data:', data);
      setCode(data.code);
      navigate('/some-path'); // Navigate to some path after submission
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