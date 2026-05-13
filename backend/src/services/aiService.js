const Groq = require("groq-sdk");

// Ta zmienna będzie przechowywać klienta
let client = null;

// Ta funkcja pozwala testom "wstrzyknąć" udawanego klienta
exports.setClient = (mockClient) => {
    client = mockClient;
};

const getClient = () => {
    if (!client) {
        client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return client;
};

exports.generateWaypoints = async (trip, user) => {
    try {
        const groq = getClient();
        console.log(`[Groq AI] Generowanie trasy: ${trip.origin.address} -> ${trip.destination.address}`);
        console.log(`[Groq AI] Generowanie trasy: ${trip.origin.address} -> ${trip.destination.address}`);

        const interests = user.preferences?.interests?.join(', ') || 'ogólne zwiedzanie';

        // DODANO: Destrukturyzacja z wartościami domyślnymi, aby uniknąć błędów przy braku pól
        const {
            intensity = 5,
            numberOfPoints = 10,
            discoverySpread = 5
        } = trip.aiSettings || {};

        const budget = trip.budget > 0 ? `${trip.budget} PLN` : 'budżet ekonomiczny';

        // DODANO: Definicja zmiennej specialRequests, której brakowało!
        const specialRequests = trip.description
            ? `DODATKOWE WYTYCZNE UŻYTKOWNIKA (PRIORYTET): ${trip.description}`
            : "Brak dodatkowych życzeń.";

        // 1. Interpretacja Rozproszenia (Discovery Spread 0-10)
        let spreadInstruction = "";
        if (discoverySpread <= 2) {
            spreadInstruction = "ŚCISŁA TRASA: Szukaj miejsc wyłącznie przy głównej drodze lub w zasięgu 5-10 minut od zjazdu.";
        } else if (discoverySpread <= 7) {
            spreadInstruction = "UMIARKOWANE ROZPROSZENIE: Możesz zbaczać z głównej drogi do 30-40 km w poszukiwaniu unikalnych miejsc.";
        } else {
            spreadInstruction = "GŁĘBOKA EKSPLORACJA: Nie ograniczaj się odległością od trasy. Szukaj najlepszych perełek w całym regionie między punktem A i B.";
        }

        // 2. Interpretacja Intensywności (Intensity 0-10)
        let intensityInstruction = "";
        if (intensity <= 3) {
            intensityInstruction = "Tempo bardzo spokojne, 1-2 główne atrakcje z czasem na relaks.";
        } else if (intensity <= 7) {
            intensityInstruction = "Tempo standardowe, zbalansowane zwiedzanie.";
        } else {
            intensityInstruction = "Tempo ekstremalne, krótkie, intensywne postoje i duża dynamika.";
        }

        const prompt = `Jesteś profesjonalnym przewodnikiem Voyager AI. 
        Zaplanuj trasę z: ${trip.origin.address} do: ${trip.destination.address}. Postaraj się zaplanować trasę między wspomnianymi lokalizacjami nie wychodzą dalej po za te lokalizacje. 
        Staraj się szukać ciekawe miejsc głównie w okolicy połowy między wspomnianymi wyżej lokalizacjami. Zwróć uwagę jakie miejscowości czy kraje są między danymi lokalizacjami tak, aby wszędzie poszukać coś ciekawego.
        
        PARAMETRY LOGICZNE:
        - GEOGRAFIA: ${spreadInstruction}
        - DYNAMIKA: ${intensityInstruction}
        - LICZBA PUNKTÓW: DOKŁADNIE ${numberOfPoints}.
        - ZAINTERESOWANIA: ${interests}.
        - BUDŻET: ${budget}.
        - KONIECZNE WYTYCZNE: ${specialRequests}

        WYMAGANIA TECHNICZNE:
        1. Każde miejsce MUSI istnieć w rzeczywistości.
        2. Podaj DOKŁADNE współrzędne geograficzne (lat, lng) jako float.
        3. Odpowiedź musi być WYŁĄCZNIE obiektem JSON.
        4. Pierwszym punktem trasy ma być ${trip.origin.address}.
        5. Ostatnim punktem trasy ma być ${trip.destination.address}.

        STRUKTURA JSON:
        {
          "waypoints": [
            {
              "name": "Pełna nazwa",
              "address": "Adres, Miasto",
              "description": "Dlaczego pasuje do profilu? Poszukaj w Internecie informacji na temat danego miejsca aby zweryfikować jego autentyczność i napisz o danym dłuższy opis konieczine około 10 zdań.",
              "location": { "lat": 0.0, "lng": 0.0 },
              "order_index": 1
            }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Jesteś precyzyjnym asystentem Voyager AI. Twoim zadaniem jest dostarczenie danych geograficznych w formacie JSON.",
                },
                { role: "user", content: prompt },
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const responseText = chatCompletion.choices[0]?.message?.content;
        const parsedData = JSON.parse(responseText);
        const waypoints = parsedData.waypoints || [];

        const validWaypoints = waypoints.map(wp => ({
            ...wp,
            location: {
                lat: parseFloat(wp.location?.lat || wp.lat),
                lng: parseFloat(wp.location?.lng || wp.lng)
            }
        })).filter(wp => !isNaN(wp.location.lat) && !isNaN(wp.location.lng));

        console.log(`[Groq AI] Sukces: Wygenerowano ${validWaypoints.length} punktów.`);
        return validWaypoints;

    } catch (error) {
        console.error("BŁĄD GROQ AI:", error);
        throw new Error("Błąd AI: " + error.message);
    }
};