import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditQuizForm from './EditQuizForm';

const EditQuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState({});
    const [showEditForm, setShowEditForm] = useState(true);

    useEffect(() => {

        fetchQuizzes();
    }, [quizId]);
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/quiz/${quizId}`);
            setQuiz(response.data);
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    };
    const handleUpdateQuiz = async (updatedQuiz) => {
        try {
            await axios.put(`http://localhost:8080/quiz/${quizId}`, updatedQuiz);
            // Optionally, you can update the local state or redirect to another page
            //setQuiz(updatedQuiz);
            // history.push('/quiz'); // Assuming you have access to the history object
            setShowEditForm(false);
            fetchQuizzes();
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };
    return (
        <div> {showEditForm && (
                <EditQuizForm
                    initialQuiz={quiz} // Pass the fetched quiz to populate form fields
                    onUpdateQuiz={handleUpdateQuiz}/>)}
        </div>
    );
};
export default EditQuizPage;
