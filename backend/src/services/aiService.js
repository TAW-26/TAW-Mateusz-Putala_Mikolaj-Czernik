const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateWaypoints = async (trip, user) => {
    try {
        console.log(`[Groq AI] Generowanie precyzyjnej trasy dla: ${trip.destination.address}`);

        const interests = user.preferences?.interests?.join(', ') || 'ogólne zwiedzanie';
        const { intensity, numberOfPoints } = trip.aiSettings;
        const budget = trip.budget > 0 ? `${trip.budget} PLN` : 'budżet ekonomiczny';
        const days = trip.duration || 1;

        const intensityDesc = [
            "bardzo niska (1-2 miejsca dziennie)",
            "niska (spokojne zwiedzanie)",
            "umiarkowana (standardowe tempo)",
            "wysoka (dużo obiektów)",
            "bardzo wysoka (maksymalna intensywność)"
        ][intensity - 1];

        // POPRAWIONY PROMPT Z ZAGNIEŻDŻONĄ STRUKTURĄ LOCATION
        const prompt = `Jesteś profesjonalnym przewodnikiem turystycznym. 
        Zaplanuj trasę z: ${trip.origin.address} do: ${trip.destination.address}. 
        
        PARAMETRY:
        - Zainteresowania: ${interests}.
        - Czas: ${days} dni.
        - Budżet: ${budget}.
        - Intensywność: ${intensity}/5 (${intensityDesc}).
        - Ilość punktów: DOKŁADNIE ${numberOfPoints}.

        KRYTYCZNE WYMAGANIA:
        1. Każde miejsce MUSI istnieć w rzeczywistości.
        2. Musisz podać DOKŁADNE współrzędne geograficzne (lat, lng) jako liczby (float).
        3. Odpowiedź musi być TYLKO I WYŁĄCZNIE obiektem JSON zawierającym tablicę "waypoints".

        STRUKTURA JSON (Musi być dokładnie taka):
        {
          "waypoints": [
            {
              "name": "Pełna nazwa miejsca",
              "address": "Dokładny adres, Miasto, Polska",
              "description": "Opis pasujący do zainteresowań",
              "location": {
                "lat": 52.2297,
                "lng": 21.0122
              },
              "order_index": 1
            }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Jesteś precyzyjnym asystentem Voyager AI. Twoim zadaniem jest dostarczenie danych geograficznych w formacie JSON. Upewnij się, że 'lat' i 'lng' są poprawnymi współrzędnymi dla podanych adresów.",
                },
                { role: "user", content: prompt },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const responseText = chatCompletion.choices[0]?.message?.content;
        const parsedData = JSON.parse(responseText);

        // Wyciągamy tablicę z obiektu (Llama przy response_format: json_object zawsze zwraca obiekt)
        const waypoints = parsedData.waypoints || [];

        // DODATKOWA WERYFIKACJA DANYCH PRZED ZAPISEM
        const validWaypoints = waypoints.map(wp => ({
            ...wp,
            location: {
                lat: parseFloat(wp.location?.lat || wp.lat), // Obsługa obu formatów na wszelki wypadek
                lng: parseFloat(wp.location?.lng || wp.lng)
            }
        })).filter(wp => !isNaN(wp.location.lat) && !isNaN(wp.location.lng));

        console.log(`[Groq AI] Sukces: Wygenerowano ${validWaypoints.length} punktów z poprawnymi koordynatami.`);
        return validWaypoints;

    } catch (error) {
        console.error("BŁĄD GROQ AI:", error);
        throw new Error("Problem z połączeniem z silnikiem AI: " + error.message);
    }
};