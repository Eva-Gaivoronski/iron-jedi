// EditQuizPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import fetchQuizzes from "./QuizTable";
import handleCloseCreateForm from "./QuizTable"

const EditQuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState({});
    const [showEditForm, setShowEditForm] = useState(true);

    // useEffect(() => {
    //     fetchQuizzes();
    // }, [quizId]);

    fetchQuizzes(quiz.id);

    const handleUpdateQuiz = async (updatedQuiz) => {
        try {
            await axios.put(`http://localhost:8080/quiz/${quizId}`, updatedQuiz);
            setShowEditForm(false);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuiz({
            ...quiz,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateQuiz(quiz);
    };

    return (
        <div>
            {showEditForm && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={quiz.title || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Category:
                        <input
                            type="text"
                            name="category"
                            value={quiz.category || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    {/* Add other form fields  */}
                    <br />
                    <button type="submit">Update Quiz</button>
                </form>
            )}
        </div>
    );
};

export default EditQuizPage;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import EditQuizForm from './EditQuizForm';
//
// const EditQuizPage = () => {
//     const { quizId } = useParams();
//     const [quiz, setQuiz] = useState({});
//     const [showEditForm, setShowEditForm] = useState(true);
//
//     useEffect(() => {
//
//         fetchQuizzes();
//     }, [quizId]);
//     const fetchQuizzes = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8080/quiz/${quizId}`);
//             setQuiz(response.data);
//         } catch (error) {
//             console.error('Error fetching quiz:', error);
//         }
//     };
//     const handleUpdateQuiz = async (updatedQuiz) => {
//         try {
//             await axios.put(`http://localhost:8080/quiz/${quizId}`, updatedQuiz);
//
//             //history.push('/quiz/quizId'); // Assuming you have access to the history object
//             setShowEditForm(false);
//             // Optionally, you can update the local state or redirect to another page
//             setQuiz(updatedQuiz);
//             fetchQuizzes();
//         } catch (error) {
//             console.error('Error updating quiz:', error);
//         }
//     };
//     return (
//         <div> {showEditForm && (
//                 <EditQuizForm
//                     initialQuiz={quiz} // Pass the fetched quiz to populate form fields
//                     onUpdateQuiz={handleUpdateQuiz}/>)}
//         </div>
//     );
// };
// export default EditQuizPage;
