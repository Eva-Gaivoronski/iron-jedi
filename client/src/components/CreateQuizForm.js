import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import fetchQuizzes from './QuizTable';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
const CreateQuiz=()=> {
    const [showModal, setShowModal] = useState(true);
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
            try {
                const response = await axios.post('http://localhost:8080/quiz/addQuiz', values);
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
            }
        };
    return (
        <div>
            <header className="App-header">
                <h1>Create Quiz</h1>
                {/* Formik handles form state and submission logic */}
                <Formik
                    initialValues={{ title: '', category: '' }}
                    validate={(values) => {
                        const errors = {};
                        // TODO Add validation logic is needed
                        return errors;
                    }}
                    //Submission logic for the form
                    onSubmit={(values, { setSubmitting }) => {
                        handleSubmit(values, true)
                            .catch(e => {
                                console.log(e);
                            })
                    }}
                >
                    {({ values, handleChange, handleSubmit }) => (
                        <Form>
                            <label>
                                Title:
                                <Field type="text" name="title" value={values.title} onChange={handleChange} />
                                {/* ErrorMessage  */}
                                <ErrorMessage name="title" component="div" />
                            </label>
                            <br />
                            <label>
                                Category:
                                <Field type="text" name="category" value={values.category} onChange={handleChange}>
                                    {/*<option value=""></option>*/}
                                    {/*we can do dropdown*/}
                                    {/* TODO Add other options here */}
                                </Field>
                                <ErrorMessage name="category" component="div" />
                            </label>
                            <br/>
                            {/* TODO: Add more fields dynamically  */}
                            <button type="submit">
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
