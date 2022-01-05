import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setResults] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://quiz-de.herokuapp.com/results?access_token=lL0bepH9Pz7wbuOy8pkAM9X1pzkhJNCS');
      const json = await response.json();
      let quizResults = {
        questions: json.questions,
        answers: json.rows.map((response) => ({
          id: response.id,
          time: new Date(response.createdAt),
          answers: response.answers.reduce((result, ans) => {
            if(ans.answer?.length > 10){
              result[`q_${ans.question}`] = ans.answer.substring(0, 7).concat('...');
            } else {
              result[`q_${ans.question}`] = ans.answer;
            }
            return result;
          }, {})
        }))
      };
      setResults(quizResults);
      console.log(quizResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Time</th>
          {
            data?.questions?.map((qn) => {
              return (<th key={qn.id} scope="col">{qn.question}</th>)
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          data?.answers?.map((answers) => {
            return (<tr key={answers.id}>
              <td>{answers.time.toLocaleString('en-GB')}</td>
              {
                data.questions.map((qn) => {
                  return (<th key={qn.id} scope="col">{answers.answers[`q_${qn.id}`]}</th>)
                })
              }
            </tr>)
          })
        }
      </tbody>
    </table>
  );
}

export default App;
