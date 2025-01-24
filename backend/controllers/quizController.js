import sqlQuery from '../utils/db.js';

export const createQuiz = async (req, res) => {
    const { title, description, questions } = req.body;

    if (!title || !description || !questions || !questions.length) {
        return res.status(400).json({ message: 'Invalid quiz data' });
    }

    try {
        // Insert quiz
        const insertQuizQuery = `
            INSERT INTO quizzes (title, description) 
            VALUES (?, ?)
        `;
        const quizResult = await sqlQuery(insertQuizQuery, [title, description]);
        const quizId = quizResult.insertId;

        // Insert questions with options
        for (const question of questions) {
            // Insert question with options included
            const insertQuestionQuery = `
                INSERT INTO questions (
                    quiz_id, 
                    question_text, 
                    option_1, 
                    option_2, 
                    option_3, 
                    option_4, 
                    correct_option
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const questionResult = await sqlQuery(insertQuestionQuery, [
                quizId, 
                question.text,
                question.options[0],
                question.options[1],
                question.options[2],
                question.options[3],
                question.correctOption
            ]);

            // Separately insert into options table
            const insertOptionsQuery = `
                INSERT INTO options (
                    question_id, 
                    text, 
                    is_correct
                ) VALUES ?
            `;
            const optionValues = question.options.map((option, index) => [
                questionResult.insertId,
                option,
                index + 1 === question.correctOption
            ]);

            await sqlQuery(insertOptionsQuery, [optionValues]);
        }

        res.status(201).json({ 
            message: 'Quiz created successfully', 
            quizId 
        });
    } catch (err) {
        console.error('Quiz creation error:', err);
        res.status(500).json({ 
            message: 'Error creating quiz', 
            error: err.message 
        });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizQuery = `
            SELECT id, title, description 
            FROM quizzes 
            ORDER BY id DESC
        `;
        const quizzes = await sqlQuery(quizQuery);
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching quizzes' });
    }
};

export const getQuizDetails = async (req, res) => {
    const { id } = req.params;

    try {
        // Get quiz details
        const quizQuery = `
            SELECT * FROM quizzes 
            WHERE id = ?
        `;
        const [quiz] = await sqlQuery(quizQuery, [id]);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Get questions with details
        const questionsQuery = `
            SELECT * FROM questions 
            WHERE quiz_id = ?
        `;
        const questions = await sqlQuery(questionsQuery, [id]);

        // Get options for each question
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const optionsQuery = `
                    SELECT * FROM options 
                    WHERE question_id = ?
                `;
                const options = await sqlQuery(optionsQuery, [question.id]);
                
                return {
                    ...question,
                    options: options
                };
            })
        );

        res.json({
            ...quiz,
            questions: questionsWithOptions
        });
    } catch (err) {
        console.error('Error fetching quiz details:', err);
        res.status(500).json({ message: 'Error fetching quiz details' });
    }
};