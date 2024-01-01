// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import QuizList from "./QuizTable";
//
// import handleCloseCreateForm from "./QuizTable"
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.bundle';
// import {Button, Modal} from "react-bootstrap";
//
// const EditQuizPage = () => {
//     const { quizId } = useParams();
//     const [quiz, setQuiz] = useState({});
//     const [showEditForm, setShowEditForm] = useState(true);
//
//     // fetchQuizzes(quiz.id);
//
//     const handleUpdateQuiz = async (updatedQuiz) => {
//         try {
//             await axios.put(`http://localhost:8080/quiz/${quizId}`, updatedQuiz);
//             setShowEditForm(false);
//             setQuiz(updatedQuiz);
//         } catch (error) {
//             console.error('Error updating quiz:', error);
//         }
//     };
//
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setQuiz({
//             ...quiz,
//             [name]: value,
//         });
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         handleUpdateQuiz(quiz);
//
//     };
//
//     return (
//         <div>
//             <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
//                 <form onSubmit={handleSubmit}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Edit Quiz</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                     <label>
//                         Title:
//                         <input
//                             type="text"
//                             name="title"
//                             value={quiz.title || ''}
//                             onChange={handleInputChange}
//                         />
//                     </label>
//                     <br />
//                     <label>
//                         Category:
//                         <input
//                             type="text"
//                             name="category"
//                             value={quiz.category || ''}
//                             onChange={handleInputChange}
//                         />
//                     </label>
//                     {/* Add other form fields  */}
//                     <br />
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button type="submit">Update Quiz</Button>
//                     </Modal.Footer>
//                 </form>
//                    </Modal>
//         </div>
//     );
// };
//
// export default EditQuizPage;
//
