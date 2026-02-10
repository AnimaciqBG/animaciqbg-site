import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Commit message:** `Add index.js to src`

**Commit!**

---

### 3. Изтрий `App.js` от root (ако все още го има)

- Върни се назад в root папката (кликни на `animaciqbg-site` в breadcrumb-а горе)
- Ако виждаш `App.js` там, изтрий го
- Трябва да остане само:
  - `public/`
  - `src/`
  - `package.json`
  - `README.md` (ако има)

---

## След като създадеш двата файла в `src/`:

Структурата ще е:
```
animaciqbg-site/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.js      ← нов
    ├── index.js    ← нов
    └── index.css   ← има го
