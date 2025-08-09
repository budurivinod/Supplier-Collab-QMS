// This is an example of a serverless function (e.g., using Node.js on Google Cloud Functions, Vercel, etc.)
// It acts as a secure proxy to the Gemini API.
// In a real environment, you would use a framework like Express or your cloud provider's SDK.

/**
 * A secure proxy function to handle requests to the Gemini API.
 *
 * @param {object} req The request object, containing the client's data.
 * @param {object} res The response object, used to send a response back to the client.
 */
exports.generateMessageProxy = async (req, res) => {
    // --- Security Step 1: Set CORS Headers ---
    // In production, restrict this to your app's actual domain for better security.
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests for CORS
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // --- Security Step 2: Get API Key from Environment Variables ---
    // The key is stored on the server, NOT in the client-side code.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in the server environment.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    // --- Step 3: Get Prompt from Client ---
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
        // --- Step 4: Call Gemini API from the Secure Backend ---
        const geminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const geminiData = await geminiResponse.json();

        // --- Step 5: Return Gemini's Response to the Client ---
        res.status(geminiResponse.status).json(geminiData);

    } catch (error) {
        console.error('Proxy function error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};