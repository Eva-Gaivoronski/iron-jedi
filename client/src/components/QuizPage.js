import React, { useState, useEffect } from 'react';
import '../App.css';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import CreateQuizForm from './CreateQuizForm';
import QuizTable from './QuizTable';

const QuizPage = () => {
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '' });
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/quiz');
                setUserQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, []);

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);};
    const handleCreateQuiz = async (values) => {
        try {
            const response = await axios.post('//localhost:8080/addQuiz/{quizId}', values);
            setUserQuizzes([...userQuizzes, response.data]);
            setNewQuiz({ title: '' });
            handleCloseCreateForm();
        } catch (error) {
            console.error('Error creating quiz:', error);}
    };
    const handleAddQuestions = (quizId) => {
        // TODO: Need logic for editing questions from Kevin
        console.log(`Add questions for quiz with ID ${quizId}`);
    };
    return (
        <div>
            <Button variant="success" onClick={handleCreateQuizButtonClick}>
                Create Quiz
            </Button>
            {/* Display quizzes using QuizTable component */}
            <QuizTable quizzes={userQuizzes} />
            <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render CreateQuizForm component and pass form-related props */}
                    <CreateQuizForm
                        onSubmit={handleCreateQuiz}
                        onCancel={handleCloseCreateForm}
                        newQuiz={newQuiz}
                        setNewQuiz={setNewQuiz}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default QuizPage;

// import React, { useState, useEffect } from 'react';
// import '../App.css';
// import { Table, Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import CreateQuizForm from './CreateQuizForm';
// import QuestionForm from './QuestionForm';
// import QuizTable from './QuizTable';
//
// const QuizPage = () => {
//     const [userQuizzes, setUserQuizzes] = useState([]);
//     const [newQuiz, setNewQuiz] = useState({ title: '' });
//     const [showCreateForm, setShowCreateForm] = useState(false);
//
//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/quiz');
//                 setUserQuizzes(response.data);
//             } catch (error) {
//                 console.error('Error fetching quizzes:', error);
//             }
//         };
//         fetchQuizzes();
//     }, []);
//
//     const handleCreateQuizButtonClick = () => {
//         setShowCreateForm(true);};
//
//     const handleCloseCreateForm = () => {
//         setShowCreateForm(false);};
//
//     const handleCreateQuiz = async () => {
//         try {
//             const response = await axios.post('http://localhost:8080/quiz', newQuiz);
//             setUserQuizzes([...userQuizzes, response.data]);
//             setNewQuiz({ title: '' });
//             handleCloseCreateForm();
//         } catch (error) {
//             console.error('Error creating quiz:', error);}
//     };
//     const handleAddQuestions = (quizId) => {
//         {/* TODO Need logic from Kevin for editing questions*/}
//         console.log(`Add questions for quiz with ID ${quizId}`);};
//     return (
//         <div>
//             <Button variant="success" onClick={handleCreateQuizButtonClick}>
//                 Create Quiz
//             </Button>
//
//             <Table striped bordered hover>
//                 <thead>
//                 <tr>
//                     <th>My Quizzes</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {userQuizzes.map((quiz) => (
//                     <tr key={quiz.id}>
//                         <td>{quiz.title}</td>
//                         <td>{quiz.category}</td>
//                         {/* Add more table cells for other quiz properties */}
//                         <td>
//                             {/* TODO Add buttons for actions (edit, take, delete) */}
//                             <Button>
//                                 {/*variant="primary" onClick={() => handleEditQuiz(quiz.id)}*/}
//                                 Edit
//                             </Button>
//                             {/*<Button variant="info" onClick={() => handleTakeQuiz(quiz.id)}>*/}
//                             {/*    Take*/}
//                             {/*</Button>*/}
//                             <Button variant="success" onClick={() => handleAddQuestions(quiz.id)}>
//                                 Add Questions
//                             </Button>
//                             {/*<Button variant="danger" onClick={() => handleDeleteQuiz(quiz.id)}>*/}
//                             {/*    Delete*/}
//                             {/*</Button>*/}
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </Table>
//             <QuizTable quizzes={userQuizzes} />
//             <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Create a New Quiz</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {/* Render CreateQuizForm component */}
//                     <CreateQuizForm
//                         handleClose={handleCloseCreateForm}
//                         handleCreateQuiz={handleCreateQuiz}
//                         newQuiz={newQuiz}
//                         setNewQuiz={setNewQuiz}
//                     />
//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// };
//
// export default QuizPage;
