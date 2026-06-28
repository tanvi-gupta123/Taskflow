const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.suggestEstimate = async (req, res) => {
  try {
    const { title, description } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert project manager.

Task Title:
${title}

Task Description:
${description}

Return ONLY JSON in this format:

{
"estimatedHours": number,
"suggestedPriority":"Low/Medium/High",
"reason":"short reason"
}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      suggestion: response,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};