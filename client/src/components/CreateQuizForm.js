import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Button, FormControl} from "react-bootstrap";
import apiClient from "./ApiClient";

const CreateQuiz=({ onClose })=> {
    const [showModal, setShowModal] = useState(true);
    const [titleError, setTitleError] = useState('');
    const username = localStorage.getItem('triviaappusername');
    const user_id = localStorage.getItem('triviaappid');

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const requiredFields = ['title', 'category', 'description'];
            const emptyFields = requiredFields.filter(field => !values[field]);

            if (emptyFields.length > 0) {
                alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
                return;
            }
            const user = {
                id: user_id,
                username: username,
            };

            const quizData = {
                ...values,
                user
            };

            const response = await apiClient.post("http://localhost:8080/quiz/quizzes", quizData)
                .then(response => {
                    console.log('Quiz data submitted:', response.data);
                    alert('Quiz saved successfully!');
                    onClose();
                })
                .catch(error => {
                    alert('Error creating new quiz');
                    console.log(error);
                })
        } catch (error) {
            console.error('Error creating quiz:', error);
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="container mt-4 border border-grey shadow p-3 mb-5 bg-white rounded">
            <header className="App-header">
            {/*    <h1 className="mb-4 shadow p-2 mb-0 bg-primary-white rounded"> Create</h1>*/}
                <Formik
                    initialValues={{title: '', category: '', description: ''}}
                    validate={(values) => {
                        const errors = {};
                        if (!values.title) {
                            errors.title = 'Title is required';
                        }
                        if (!values.category) {
                            errors.category = 'Category is required';
                        }
                        if (!values.description) {
                            errors.description = 'Description is required';
                        }
                        return errors;
                    }}
                    //Submission logic
                    onSubmit={(values, {setSubmitting}) => handleSubmit(values, {setSubmitting})}
                >
                    {({values, handleChange, handleSubmit, errors}) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput">
                                    Title:
                                    <Field type="text" className="form-control" id="formGroupExampleInput"
                                           placeholder="add title" name="title" value={values.title}
                                           onChange={handleChange}/>

                                    {errors.title && <div className="error-message">{errors.title}</div>}
                                </label>
                                <br/>
                                <label htmlFor="formGroupExampleInput">
                                    Category:
                                    <Field type="text" className="form-control" id="formGroupExampleInput"
                                           placeholder="add category" name="category" value={values.category}
                                           onChange={handleChange}>
                                    </Field>
                                    <ErrorMessage name="category" component="div"/>
                                </label>
                                <br/>
                                <label htmlFor="formGroupExampleInput">
                                    Description:
                                    <Field type="text" className="form-control" id="formGroupExampleInput"
                                           placeholder="describe your quiz" name="description" value={values.description}
                                           onChange={handleChange}>
                                    </Field>
                                    <ErrorMessage name="description" component="div"/>
                                </label>
                                <br/>
                                <Button type="submit" className="btn btn-primary btn-lg btn-block">
                                    Create Quiz
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </header>
        </div>
    );
}
export default CreateQuiz;
