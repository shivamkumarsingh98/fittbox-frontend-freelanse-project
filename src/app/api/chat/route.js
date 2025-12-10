import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini-pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Context for the AI to understand its role
const SYSTEM_CONTEXT = `You are FittBox's AI assistant. FittBox is a healthy meal delivery service that specializes in diet food, protein meals, and customized meal plans.
Key information about FittBox:
- Offers various meal plans: Fat Loss, Muscle Building, Balanced Nourishment
- Provides fresh, healthy food delivery
- Available meal types: Salads, Acai bowls, High Protein bowls, Smoothie bowls
- Delivery available through website and food delivery apps
- Accepts payments via cards and UPI
- Can create custom meal plans based on nutritionist's recommendations

Please keep responses friendly, concise, and focused on FittBox's services. If asked about unrelated topics, politely redirect to FittBox-related information.`;

export async function POST(request) {
  try {
    const { message } = await request.json();

    // Start chat and provide context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "What are you and what can you help with?",
        },
        {
          role: "model",
          parts: "I'm FittBox's AI assistant, here to help you with information about our healthy meal delivery service. I can tell you about our meal plans, delivery options, payment methods, and answer questions about healthy eating and nutrition in the context of our services.",
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    // Send user's message with context
    const result = await chat.sendMessage(
      `${SYSTEM_CONTEXT}\n\nUser's question: ${message}`
    );
    const response = result.response.text();

    return Response.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "Sorry, I'm having trouble right now. Please try again later." },
      { status: 500 }
    );
  }
}