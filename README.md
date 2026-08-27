# Alerta Nationala - Dashboard Web (Operator)

Panou de administrare in React + Vite, folosit de operatori pentru a emite alerte, a urmari rata de confirmare si a gestiona punctele de adunare.

## Instructiuni de rulare

### Cerinte
- Node.js 18+
- Backend-ul pornit local sau folosind adresa backend-ului deja deployat

### Pasi
```bash
git clone <repo-url> alerta-nationala-web
cd alerta-nationala-web
npm install
npm run dev
```
Aplicatia porneste implicit pe `http://localhost:5173`.

De asemenea, aplicatia este disponibila si online, la adresa: https://alerta-nationala-web.vercel.app/.
### Cont de test (operator)
Email: alexia.elena.aldea@gmail.com
Parola: 123456

### Populare cu date pentru testare vizuala
Dupa autentificare, din pagina "Alerta noua" creezi cateva alerte pentru un judet, iar din "Puncte de adunare" adaugi 2-3 puncte pe harta (click direct pe harta pentru pozitie).

---

## Arhitectura acestei componente

- **Autentificare:** `services/auth.ts` gestioneaza login/refresh/logout si expune un helper `authRequest` care ataseaza automat tokenul si reincearca o data dupa refresh la un 401. Un `CustomEvent` (`AUTH_SESSION_EXPIRED_EVENT`) notifica `App.tsx` cand sesiunea chiar a expirat (refresh esuat), pentru a intoarce userul la login.
- **Harta:** Leaflet + `react-leaflet` (v4, compatibil cu React 18) peste tile-uri OpenStreetMap - gratuit, fara API key.
- **Stilizare:** CSS Modules + variabile CSS globale (`styles/colors.css`), cu suport light/dark prin atributul `data-theme` pe `<html>`.

## Pagini implementate
- Autentificare operator (`/`)
- Lista alertelor, cu creare si incheiere (`/home`, `/alerts/new`)
- Dashboard-ul unei alerte, cu confirmarile si check-in-urile primite (panou lateral la selectarea unei alerte din lista)
- Gestionarea punctelor de adunare, cu harta (`/zones`)

## Justificari tehnice specifice acestei componente
- **Leaflet, nu Google Maps** - nu necesita API key/card pentru facturare.
