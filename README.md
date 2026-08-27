# Alertă Națională — Dashboard Web (Operator)

Panou de administrare în React + Vite, folosit de operatori pentru a emite alerte, urmări rata de confirmare și gestiona punctele de adunare.

> Arhitectura de ansamblu a sistemului și schema bazei de date sunt descrise în README-ul repo-ului de backend — aici sunt doar detaliile specifice acestei componente.

## Instrucțiuni de rulare

### Cerințe
- Node.js 18+
- Backend-ul pornit local (vezi README-ul de backend) sau adresa unui backend deja deployat

### Pași
```bash
git clone <repo-url> alerta-nationala-web
cd alerta-nationala-web
npm install
```

Creezi `.env` la rădăcină:
```
VITE_API_BASE_URL=http://localhost:3000/
```
(verifică numele exact al variabilei în `src/services/auth.ts` / fișierul de configurare a URL-ului de bază, dacă diferă)

```bash
npm run dev
```
Aplicația pornește implicit pe `http://localhost:5173`.

### Cont de test (operator)
Vezi README-ul de backend pentru credențiale și pentru pasul de promovare manuală la rol de operator (`operator@test.com` / `Test1234!`).

### Populare cu date pentru testare vizuală
După autentificare, din pagina "Alerta nouă" creezi câteva alerte pentru un județ, iar din "Puncte de adunare" adaugi 2-3 puncte pe hartă (click direct pe hartă pentru poziție), ca dashboard-ul să nu fie gol la prima rulare.

---

## Arhitectura acestei componente

- **Routing:** un router minimal, scris manual (`window.history.pushState` + `popstate`), fără `react-router` — suficient pentru cele 4 pagini cerute (login, alerte, alertă nouă, puncte de adunare), fără dependință în plus.
- **Autentificare:** `services/auth.ts` gestionează login/refresh/logout și expune un helper `authRequest` care atașează automat tokenul și reîncearcă o dată după refresh la un 401. Un `CustomEvent` (`AUTH_SESSION_EXPIRED_EVENT`) notifică `App.tsx` când sesiunea chiar a expirat (refresh eșuat), pentru a întoarce userul la login.
- **Hartă:** Leaflet + `react-leaflet` (v4, compatibil cu React 18) peste tile-uri OpenStreetMap — gratuit, fără API key.
- **Stilizare:** CSS Modules + variabile CSS globale (`styles/colors.css`), cu suport light/dark prin atributul `data-theme` pe `<html>`.

## Pagini implementate
- Autentificare operator (`/`)
- Lista alertelor, cu creare și încheiere (`/home`, `/alerts/new`)
- Dashboard-ul unei alerte, cu confirmările și check-in-urile primite (panou lateral la selectarea unei alerte din listă)
- Gestionarea punctelor de adunare, cu hartă (`/zones`)

## Justificări tehnice specifice acestei componente
- **Leaflet, nu Google Maps** — nu necesită API key/cont de facturare, potrivit pentru un proiect de facultate fără buget.
- **react-leaflet v4, nu v5** — v5 cere React 19; proiectul e pe React 18, iar upgrade-ul de React n-a fost justificat doar pentru hartă.
- **Fără librărie de formulare** (React Hook Form, Formik) — formularele sunt scurte (2-5 câmpuri), validarea manuală simplă a fost suficientă și mai ușor de urmărit pentru evaluare.

## Ce nu am terminat și ce aș fi făcut diferit
- Dashboard-ul alertei arată rata de confirmare ca listă simplă de check-in-uri, fără un grafic — aș fi adăugat un mic grafic de evoluție a confirmărilor în timp, dacă ar fi fost cerut explicit.
- Formularul de creare a punctelor de adunare nu permite editarea poziției unui punct existent direct de pe hartă (doar câmpurile text) — a fost o decizie deliberată, ca să nu mut accidental un punct existent la un click greșit pe hartă, dar ar putea fi îmbunătățit cu un mod explicit de "editare poziție".
- Nu există confirmare ("ești sigur?") înainte de dezactivarea unui punct de adunare — pentru un panou de administrare real aș adăuga un dialog de confirmare.
