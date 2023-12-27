import React, { useState } from 'react';

const EditQuizForm = ({ initialQuiz, onUpdateQuiz }) => {
    const [updatedQuiz, setUpdatedQuiz] = useState({
        title: initialQuiz.title || '',
        category: initialQuiz.category || '',
        // Add other fields as needed
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQuiz({
            ...updatedQuiz,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the updated quiz data to the parent component for submission
        onUpdateQuiz(updatedQuiz);};
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text"
                    name="title"
                    value={updatedQuiz.title}
                    onChange={handleInputChange}/>
            </label>
            <br />
            <label>
                Category:
                <input type="text"
                    name="category"
                    value={updatedQuiz.category}
                    onChange={handleInputChange}/>
            </label>
            {/* Add other form fields as needed */}
            <br />
            <button type="submit">Update Quiz</button>
        </form>
    );
};

export default EditQuizForm;
