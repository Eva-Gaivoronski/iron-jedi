import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Button} from "react-bootstrap";
const CreateQuiz=()=> {
    const [showModal, setShowModal] = useState(true);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
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
                handleCloseModal();
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
                {/* Formik handles form state and submission logic */}
                <Formik
                    initialValues={{ title: '', category: '', username: '' }}
                    validate={(values) => {
                        const errors = {};
                        // TODO Add validation logic is needed
                        return errors;
                    }}
                    //Submission logic
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values, { setSubmitting });
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form>
                            <label>
                                Title:
                                <Field type="text" name="title" value={values.title} onChange={handleChange}/>
                                {/* ErrorMessage  */}
                                <ErrorMessage name="title" component="div"/>
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