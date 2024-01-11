import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Button} from "react-bootstrap";
const CreateQuiz=({ onClose })=> {
    const [showModal, setShowModal] = useState(true);
    const [titleError, setTitleError] = useState('');

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Validate if all fields are filled
            const requiredFields = ['title', 'category', 'username']; // Add other required fields if needed
            const emptyFields = requiredFields.filter(field => !values[field]);

            if (emptyFields.length > 0) {
                // Display notification to the user
                alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
                return;
            }

            // Rest of your submission logic...

            const user = {
                id: 1, // Replace with the user ID
                username: values.username, // username is entered in the form
            };

            const quizData = {
                ...values,
                user,
            };

            const response = await axios.post('http://localhost:8080/quiz/quizzes', values);
            console.log('Quiz data submitted:', values);
            alert('Quiz saved successfully!');
            // TODO finish the logic
            // TODO post it
            // TODO fetch quizes again
            //await fetchQuizzes();
            // TODO close the model
            onClose();
        } catch (error) {
            console.error('Error creating quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div>
            <header className="App-header">
                <h1>Create Quiz</h1>
                <Formik
                    initialValues={{ title: '', category: '', username: '' }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.title) {
                            errors.title = 'Title is required';
                        }
                        if (!values.category) {
                            errors.category = 'Category is required';
                        }
                        if (!values.username) {
                            errors.username = 'User is required';
                        }
                        return errors;
                    }}
                    //Submission logic
                    onSubmit={(values, { setSubmitting }) => handleSubmit(values, { setSubmitting })}
                >
                    {({ values, handleChange, handleSubmit, errors  }) => (
                        <Form>
                            <label>
                                Title:
                                <Field type="text" name="title" value={values.title} onChange={handleChange}/>
                                {/* ErrorMessage  */}
                                {errors.title && <div className="error-message">{errors.title}</div>}
                            </label>
                            <br/>
                            <label>
                                Category:
                                <Field type="text" name="category" value={values.category} onChange={handleChange}>
                                    {/*<option value=""></option>*/}
                                    {/*we can do dropdown*/}
                                    {/* TODO Add other options here */}
                                </Field>
                                <ErrorMessage name="category" component="div"/>
                            </label>
                            <br/>
                            <label>
                                User
                                <Field type="text" name="username" value={values.username} onChange={handleChange} />
                                {/* ErrorMessage  */}
                                <ErrorMessage name="username" component="div"/>
                            </label>
                            <Button type="submit">
                                Create Quiz
                            </Button>
                        </Form>
                    )}
                </Formik>
            </header>
        </div>
    );
}
export default CreateQuiz;
