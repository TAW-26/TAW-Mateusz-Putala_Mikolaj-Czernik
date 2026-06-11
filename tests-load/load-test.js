import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfiguracja symulacji ruchu (20 użytkowników bombarduje serwer)
export const options = {
    stages: [
        { duration: '10s', target: 20 }, // Wzrost ruchu do 20 użytkowników
        { duration: '20s', target: 20 }, // Stabilne obciążenie przez 20 sekund
        { duration: '10s', target: 0 },  // Schodzenie z ruchu do zera
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // Kryterium sukcesu: 95% żądań poniżej 500ms
    },
};

export default function () {
    // Testujemy główny endpoint backendu w Dockerze
    const res = http.get('http://backend:5000/');

    check(res, {
        'status wynosi 200': (r) => r.status === 200,
    });

    sleep(1);
}