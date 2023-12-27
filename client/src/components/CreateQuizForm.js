import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

function CreateQuiz() {
    // const handleSubmit = async (values, { setSubmitting }) => {
    //         try {
    //             const response = await axios.post('http://localhost:8080/quiz', values);
    //             // TODO finish the logic
    //             console.log('Quiz data submitted:', values);
    //             alert('Quiz saved successfully!');
    //         } catch (error) {
    //             console.error('Error creating quiz:', error);
    //         }
    //     };
    return (
        <div>
            <header className="App-header">
                <h1>Create Quiz</h1>
                {/* Formik handles form state and submission logic */}
                <Formik
                    initialValues={{ title: '', category: '' }}
                    // Validation logic for form fields
                    validate={(values) => {
                        const errors = {};
                        // Add validation logic if needed
                        return errors;
                    }}
                    // Submission logic for the form
                    onSubmit={(values, { setSubmitting }) => {
                        // Simulate API request
                        setTimeout(() => {
                            console.log('Quiz data submitted:', values);
                            alert('Quiz saved successfully!');
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {/* Formik provides form state and helper functions */}
                    {({ values, handleChange, handleSubmit }) => (
                        <Form>
                            {/* Form field for quiz title */}
                            <label>
                                Title:
                                {/* Field component handles input */}
                                <Field type="text" name="title" value={values.title} onChange={handleChange} />
                                {/* ErrorMessage component displays validation errors */}
                                <ErrorMessage name="title" component="div" />
                            </label>
                            <br />
                            {/* Form field for quiz category */}
                            <label>
                                Category:
                                {/* Field component for dropdown/select */}
                                <Field type="text" name="category" value={values.category} onChange={handleChange}>
                                    {/*<option value=""></option>*/}
                                    {/* Add other options here */}
                                </Field>
                                {/* ErrorMessage component for category */}
                                <ErrorMessage name="category" component="div" />
                            </label>
                            <br/>
                            {/* TODO: Add more fields dynamically based on values */}
                            {/* Submit button triggers handleSubmit function */}
                            <button type="submit" onClick={handleSubmit}>
                                Create Quiz
                            </button>
                        </Form>
                    )}
                </Formik>
            </header>
        </div>
    );
}
export default CreateQuiz;

// import React, { useState, useEffect } from 'react';
// import '../App.css';
// import QuestionForm from './QuestionForm';
// import QuizPage from "./QuizPage";
// import axios from "axios";
//
// function CreateQuiz() {
//     const [username, setUsername] = useState('');
//     const [quizData, setQuizData] = useState({
//         title: '',
//         category: '',
//         // TODO extra fields
//     });
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setQuizData({
//             ...quizData,
//             [name]: value,
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8080/quiz', quizData);
//             // TODO finish the logic
//             console.log('Quiz data submitted:', quizData);
//             alert('Quiz saved successfully!');
//         } catch (error) {
//             console.error('Error creating quiz:', error);
//         }
//         }
//         ;
//
//         return (
//             <div>
//                 <header className="App-header">
//                     <h1>Create Quiz</h1>
//                     <form onSubmit={handleSubmit}>
//                         <label>
//                             Title:
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={quizData.title}
//                                 onChange={handleInputChange}
//                             />
//                         </label>
//                         <br/>
//                         <label>
//                             Category:
//                             <input
//                                 type="text"
//                                 name="category"
//                                 value={quizData.category}
//                                 onChange={handleInputChange}
//                             />
//                         </label>
//                         <br/>
//                         {/* TODO fields */}
//
//                         <button type="submit">Create Quiz</button>
//                     </form>
//                 </header>
//             </div>
//
// );
// }
//
// export default CreateQuiz;
