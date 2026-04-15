const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateWaypoints = async (trip, user) => {
    try {
        console.log(`[Groq AI] Generowanie trasy dla: ${trip.destination.address}`);

        const interests = user.preferences?.interests?.join(', ') || 'ogólne zwiedzanie';

        const prompt = `Jesteś profesjonalnym planerem podróży. 
        Zaplanuj trasę z: ${trip.origin.address} do: ${trip.destination.address}. 
        Podróżnik interesuje się: ${interests}.
        Zwróć odpowiedź WYŁĄCZNIE jako poprawny format JSON (tablica obiektów), bez żadnego wstępu i zakończenia:
        [
          {
            "name": "Nazwa miejsca",
            "description": "Krótki opis atrakcji",
            "lat": 52.2297,
            "lng": 21.0122,
            "order_index": 1
          }
        ]`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Jesteś asystentem, który odpowiada wyłącznie w formacie JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            // ZMIANA TUTAJ:
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const responseText = chatCompletion.choices[0]?.message?.content;

        // Parsowanie wyniku
        const data = JSON.parse(responseText);
        return Array.isArray(data) ? data : (data.waypoints || Object.values(data)[0]);

    } catch (error) {
        console.error("BŁĄD GROQ AI:", error);
        throw new Error("Problem z połączeniem z Groq: " + error.message);
    }
};