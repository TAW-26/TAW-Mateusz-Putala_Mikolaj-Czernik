const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateWaypoints = async (trip, user) => {
    try {
        console.log(`[Groq AI] Generowanie trasy dla: ${trip.destination.address}`);

        // 1. Pobranie zainteresowań użytkownika
        const interests = user.preferences?.interests?.join(', ') || 'ogólne zwiedzanie';

        // 2. Pobranie zaawansowanych ustawień wycieczki ze schematu
        const { intensity, numberOfPoints, extraTimeTolerance } = trip.aiSettings;
        const budget = trip.budget > 0 ? `${trip.budget} PLN` : 'budżet ekonomiczny';

        // Wykorzystanie virtuala 'duration' lub ręczne wyliczenie dni
        const days = trip.duration || 1;

        // Opis intensywności dla AI
        const intensityDesc = [
            "bardzo niska (spokojne tempo, dużo odpoczynku)",
            "niska (relaksujące zwiedzanie)",
            "umiarkowana (standardowe tempo)",
            "wysoka (intensywne zwiedzanie wielu miejsc)",
            "bardzo wysoka (maksymalna liczba atrakcji w krótkim czasie)"
        ][intensity - 1];

        // 3. Budowanie precyzyjnego promptu
        const prompt = `Jesteś profesjonalnym planerem podróży. 
        Zaplanuj trasę z: ${trip.origin.address} do: ${trip.destination.address}. 
        
        PARAMETRY WYCIECZKI:
        - Interesy podróżnika: ${interests}.
        - Czas trwania: ${days} dni.
        - Budżet: ${budget}.
        - Intensywność: ${intensity}/5 (${intensityDesc}).
        - Liczba punktów do wygenerowania: DOKŁADNIE ${numberOfPoints}.
        - Tolerancja czasu na zbaczanie z trasy: ${extraTimeTolerance}%.

        WYMAGANIA DOTYCZĄCE ODPOWIEDZI:
        - Zwróć DOKŁADNIE ${numberOfPoints} punktów trasy.
        - Dopasuj atrakcje do intensywności (np. przy intensywności 5 wybierz miejsca blisko siebie, by zdążyć odwiedzić wszystkie).
        - Odpowiedź musi być WYŁĄCZNIE poprawnym formatem JSON (tablica obiektów) bez dodatkowego tekstu:
        [
          {
            "name": "Nazwa miejsca",
            "description": "Krótki opis (max 2 zdania) wyjaśniający wybór",
            "lat": 52.1234,
            "lng": 21.1234,
            "order_index": 1
          }
        ]`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Jesteś precyzyjnym asystentem podróży. Generujesz dane wyłącznie w formacie JSON, ściśle przestrzegając zadanych parametrów logistycznych.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const responseText = chatCompletion.choices[0]?.message?.content;
        const data = JSON.parse(responseText);

        // Zwracamy tablicę (obsługa różnych formatów opakowania przez AI)
        const waypoints = Array.isArray(data) ? data : (data.waypoints || Object.values(data)[0]);

        console.log(`[Groq AI] Sukces: Wygenerowano ${waypoints.length} punktów.`);
        return waypoints;

    } catch (error) {
        console.error("BŁĄD GROQ AI:", error);
        throw new Error("Problem z połączeniem z Groq: " + error.message);
    }
};