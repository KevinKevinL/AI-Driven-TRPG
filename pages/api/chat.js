import { fetchChatGPTResponse } from '../../utils/chatAPI';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  const { messages } = req.body;
  const result = await fetchChatGPTResponse(messages);

  if (result.success) {
    res.status(200).json({ reply: result.reply });
  } else {
    res.status(500).json({ error: result.error });
  }
}
