import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SubmitResponse = () => {
  const { code } = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const STATIC_TOKEN = 'b4f7598791729ecb1a81b48b5c46eabc45dac376a0e27189f5345c1961f48840'; // Your generated token

  useEffect(() => {
    fetchQuestions(code);
  }, [code]);

  const fetchQuestions = async (code) => {
    console.log('Fetching questions for code:', code);
    try {
      const response = await fetch(`http://localhost:5001/api/questions/${code}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${STATIC_TOKEN}` // Use the static token
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.questions);
      setResponses(new Array(data.questions.length).fill(''));
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting responses:', responses);
    try {
      const response = await fetch('http://localhost:5001/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${STATIC_TOKEN}` // Use the static token
        },
        body: JSON.stringify({ code, responses }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit responses');
      }
      setSubmissionStatus('Responses submitted successfully!');
    } catch (error) {
      console.error('Error during fetch:', error);
      setSubmissionStatus('Error during submission');
    }
  };

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index}>
            <p>{question}</p>
            <textarea
              value={responses[index]}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              placeholder="Your response..."
            />
          </div>
        ))}
        <button type="submit">Submit Responses</button>
      </form>
      {submissionStatus && <p>{submissionStatus}</p>} {/* Display submission status */}
    </div>
  );
};

export default SubmitResponse;

