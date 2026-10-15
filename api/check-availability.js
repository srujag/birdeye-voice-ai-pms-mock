export default async function handler(req, res) {
  // Allow requests from Retell AI
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // Retell sends function arguments inside req.body.args or req.body directly
    const body = req.body || {};
    const args = body.args || body;
    const preferredDate = args.preferred_date || 'today';

    // Mock Practice Management Database (Dentrix / Open Dental Schema)
    const mockPracticeDatabase = {
      "friday": ["10:00 AM", "02:30 PM", "04:15 PM"],
      "monday": ["09:00 AM", "11:30 AM", "03:00 PM"],
      "2026-10-23": ["10:00 AM", "02:30 PM", "04:15 PM"]
    };

    const dateKey = String(preferredDate).toLowerCase();
    const slots = mockPracticeDatabase[dateKey] || ["11:00 AM", "03:30 PM"];

    // Return exact payload back to Retell Voice Agent
    return res.status(200).json({
      success: true,
      practice_name: "BrightSmile Dental",
      requested_date: preferredDate,
      available_slots: slots,
      message: `Found ${slots.length} available appointment slots.`
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to process practice database query',
      details: error.message 
    });
  }
}
