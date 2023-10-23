// Container controller functions for each route (get,post,delete,patch)
// We can call those function directly in question.js

const Question = require("../models/questionModel");
const mongoose = require("mongoose");

// get all questions
const getQuestions = async (req, res) => {
	console.log("GETQUESTIONS");
	const questions = await Question.find({}).sort({ createdAt: 1 });

	res.status(200).json(questions);
};

// get a single question
const getQuestion = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "No such question" });
	}

	const question = await Question.findById(id);

	if (!question) {
		return res.status(404).json({ error: "Question not found" });
	}

	res.status(200).json(question);
};

const getRandomEasyQuestion = async (req, res) => {
	console.log("EASYQUESTION");
	try {
		const randomEasyQuestion = await Question.aggregate([
			{ $match: { complexity: "Easy" } }, // Filter by complexity 'easy'
			{ $sample: { size: 1 } }, // Retrieve a random question
		]);

		if (!randomEasyQuestion || randomEasyQuestion.length === 0) {
			return res
				.status(404)
				.json({ error: "No random easy question found" });
		}
		console.log("EASYQUESTION" + randomEasyQuestion[0]);
		res.status(200).json(randomEasyQuestion[0]); // Send the random easy question
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

const getRandomMediumQuestion = async (req, res) => {
	try {
		const randomEasyQuestion = await Question.aggregate([
			{ $match: { complexity: "Medium" } }, // Filter by complexity 'easy'
			{ $sample: { size: 1 } }, // Retrieve a random question
		]);

		if (!randomEasyQuestion || randomEasyQuestion.length === 0) {
			return res
				.status(404)
				.json({ error: "No random Medium question found" });
		}

		res.status(200).json(randomEasyQuestion[0]); // Send the random easy question
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

const getRandomHardQuestion = async (req, res) => {
	try {
		const randomEasyQuestion = await Question.aggregate([
			{ $match: { complexity: "Hard" } }, // Filter by complexity 'easy'
			{ $sample: { size: 1 } }, // Retrieve a random question
		]);

		if (!randomEasyQuestion || randomEasyQuestion.length === 0) {
			return res
				.status(404)
				.json({ error: "No random Hard question found" });
		}

		res.status(200).json(randomEasyQuestion[0]); // Send the random easy question
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
};

const initializeQuestions = async (defaultQuestions) => {
	// Check if questions exist
	const existingQuestions = await Question.find();

	if (existingQuestions.length === 0) {
		// Insert the default questions
		await Question.create(defaultQuestions);
		console.log("Default questions added.");
	}
};

// create a new question
const createQuestion = async (req, res) => {
	const { title, complexity, category, description, upvotes } = req.body;

	console.log(req.body);
	let emptyFields = [];

	if (!title) {
		emptyFields.push("title");
	}
	if (!complexity) {
		emptyFields.push("complexity");
	}
	if (!category || category.length === 0) {
		emptyFields.push("category");
	}
	if (!description) {
		emptyFields.push("description");
	}
	if (emptyFields.length > 0) {
		console.log(emptyFields);
		return res
			.status(400)
			.json({ error: "Please fill in all the fields", emptyFields });
	}

	//add doc to db
	try {
		const existingQuestion = await Question.findOne({
			$or: [{ title }, { description }],
		});
		if (existingQuestion) {
			let errorMessage = "";

			// Check if the title and/or description is a duplicate
			if (existingQuestion.title === title) {
				errorMessage = "A question with the same title already exists.";
				emptyFields.push("title");
				if (existingQuestion.description === description) {
					errorMessage =
						"A question with the same title and description already exists.";
					emptyFields.push("description");
				}
			} else {
				errorMessage =
					"A question with the same description already exists.";
				emptyFields.push("description");
			}

			return res.status(400).json({ error: errorMessage, emptyFields });
		}
		const question = await Question.create({
			title,
			complexity,
			category,
			description,
			upvotes,
		});
		res.status(200).json(question);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

// delete a question
const deleteQuestion = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "No such question" }); //404 is not found
	}

	const question = await Question.findOneAndDelete({ _id: id });

	if (!question) {
		return res.status(400).json({ error: "Question not found" }); //400 is bad request
	}

	res.status(200).json(question); //200 is ok
};

// update a question
const updateQuestion = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "No such question" });
	}

	const question = await Question.findOneAndUpdate(
		{ _id: id },
		{ ...req.body },
		{ new: true, runValidators: true }
	);

	if (!question) {
		return res.status(400).json({ error: "Question not found" });
	}

	res.status(200).json(question);
};

module.exports = {
	getQuestions,
	getQuestion,
	createQuestion,
	initializeQuestions,
	deleteQuestion,
	updateQuestion,
	getRandomEasyQuestion,
	getRandomMediumQuestion,
	getRandomHardQuestion,
};
