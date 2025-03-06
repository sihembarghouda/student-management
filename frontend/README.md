Gestion des Étudiants

📌 Description

Ce projet est une application web permettant de gérer une liste d'étudiants.
Il utilise FastAPI pour le backend et Next.js pour le frontend.

🛠 Technologies utilisées

Backend : FastAPI, Uvicorn, MySQL

Frontend : Next.js, React, TailwindCSS

Base de données : MySQL

🚀 Installation et exécution du projet

1️⃣ Cloner le projet

git clone https://github.com/votre-repo/fastapi-nextjs-students.git
cd fastapi-nextjs-students

2️⃣ Backend (FastAPI)

📌 Installation des dépendances

cd backend
python -m venv venv
source venv/bin/activate  # Sur macOS/Linux
venv\Scripts\activate  # Sur Windows
pip install -r requirements.txt

🚀 Lancer le serveur FastAPI

uvicorn main:app --reload

FastAPI sera disponible sur : http://127.0.0.1:8000
Documentation interactive Swagger : http://127.0.0.1:8000/docs

3️⃣ Frontend (Next.js)

📌 Installation des dépendances

cd ../frontend
npm install

🚀 Lancer le serveur Next.js

npm run dev

L'application frontend sera accessible sur : http://localhost:3000

📂 Structure du projet

fastapi-nextjs-students/
│── backend/              # Code du backend FastAPI
│   ├── main.py           # Point d'entrée FastAPI
│   ├── models.py         # Modèles SQLAlchemy
│   |
│   ├── database.py       # Configuration MySQL
│── frontend/             # Code du frontend Next.js
│   ├── app/              # App Router de Next.js
│   ├── components/       # Composants réutilisables
│   ├── styles/           # Fichiers CSS/Tailwind
│── README.md             # Documentation du projet
│── requirements.txt      # Dépendances FastAPI
│── package.json          # Dépendances Next.js

📌 Fonctionnalités

✅ Ajouter un étudiant
✅ Modifier les informations d'un étudiant
✅ Supprimer un étudiant
✅ Lister tous les étudiants
✅ Interface utilisateur moderne avec Next.js

🤝 Contribution

Fork le projet

Crée une branche (git checkout -b feature-nom_fonctionnalité)

Fait des modifications et commit (git commit -m "Ajout de la fonctionnalité X")

Push la branche (git push origin feature-nom_fonctionnalité)

Ouvre une Pull Request

📜 Licence

Ce projet est sous licence MIT.

📞 Contact

📧 Email : sihembarghouda93@gmail.com
📌 GitHub : sihembarghouda