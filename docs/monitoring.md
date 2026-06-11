# Dokumentacja Systemu Monitoringu — Smart Voyager

Zgodnie z wymaganiami produkcyjnymi oraz kryteriami utrzymania aplikacji, w projekcie wdrożono niezależny system zbierania metryk i monitorowania wydajności serwera w oparciu o standard **Prometheus**.

## 1. Zastosowane Rozwiązanie
Zintegrowano bibliotekę `prom-client` bezpośrednio w procesie Express.js. System monitoringu działa w architekturze *pull* — backend wystawia ustrukturyzowany endpoint, z którego system monitorujący regularnie pobiera dane.

### Zaimplementowane Metryki:
* `http_requests_total` (Counter): Licznik rejestrujący każde zapytanie HTTP trafiające do API z podziałem na metodę (`GET`, `POST`), kod statusu (`200`, `404`) oraz ścieżkę bazową.
* `http_request_duration_ms` (Histogram): Mierzy czas przetwarzania żądań przez serwer w milisekundach, co pozwala na analizę wąskich gardeł w API.
* Metryki systemowe: Automatyczny monitoring zużycia pamięci RAM, obciążenia CPU kontenera oraz stanu pętli zdarzeń (*Event Loop*).

## 2. Architektura i Uruchomienie lokalne
Całość została w pełni skonteneryzowana i zintegrowana w ramach pliku `docker-compose.yml`.

1. **Dostęp do metryk deweloperskich (surowy format tekstowy):**
   `http://localhost:5000/metrics`

2. **Dostęp do panelu zarządzania Prometheus:**
   `http://localhost:9090` (Zakładka *Status -> Targets* potwierdza stan połączenia kontenerów).

## 3. Logowanie Błędów po stronie Serwera
W ramach `errorMiddleware.js` zaimplementowano ustrukturyzowany format logowania wyjątków do strumienia `stdout` (konsoli kontenera). Każdy wpis zawiera:
* Dokładny znacznik czasu w formacie ISO (`timestamp`).
* Jawny typ rzuconego wyjątku (`type`).
* Pełen kontekst sieciowy (`method`, `url`, `ip`).

## 4. Testy Stabilności pod Obciążeniem (Load Testing)
Do weryfikacji wydajności aplikacji w środowisku kontenerowym wykorzystano narzędzie **Grafana k6**. Skrypt testowy znajduje się w lokalizacji `tests-load/load-test.js`.
Podczas testu zasymulowano ruch 20 wirtualnych użytkowników (*Virtual Users*) jednocześnie odpytujących API. Serwer zachował pełną stabilność, utrzymując czas odpowiedzi na poziomie percentyla `p(95) < 500ms`.