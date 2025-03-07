# Importation des modules nécessaires
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

# Initialisation de l'application FastAPI
app = FastAPI()

# Configuration de CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001",],  #  le port de votre frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Définition du Modèle Pydantic pour un étudiant
class StudentBase(BaseModel):
    name: str
    age: int
    major: Optional[str] = None

# Modèle pour les requêtes de création (sans ID)
class StudentCreate(StudentBase):
    pass

# Modèle pour les réponses et mises à jour (avec ID)
class Student(StudentBase):
    id: int

# Base de données temporaire (liste d'étudiants)
students_db = [
    {"id": 1, "name": "Alice", "age": 20, "major": "Informatique"},
    {"id": 2, "name": "Bob", "age": 22, "major": "Mathématiques"},
    {"id": 3, "name": "Charlie", "age": 21, "major": "Physique"},
]

# Route pour obtenir tous les étudiants
@app.get("/students", response_model=List[Student])
def get_students():
    return students_db

# Route pour obtenir un étudiant par ID
@app.get("/students/{student_id}", response_model=Student)
def get_student(student_id: int):
    student = next((s for s in students_db if s['id'] == student_id), None)
    if student is None:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    return student

# Route pour ajouter un nouvel étudiant
@app.post("/students", response_model=Student)
def create_student(student: StudentCreate):
    # Calculer le nouvel ID en trouvant le maximum actuel et en ajoutant 1
    new_id = max(s["id"] for s in students_db) + 1 if students_db else 1
    
    # Créer un dictionnaire avec les données de l'étudiant
    student_dict = student.dict()
    student_dict["id"] = new_id
    
    # Ajouter l'étudiant à la base de données
    students_db.append(student_dict)
    return student_dict

# Route pour mettre à jour un étudiant existant
@app.put("/students/{student_id}", response_model=Student)
def update_student(student_id: int, updated_student: StudentBase):
    for index, student in enumerate(students_db):
        if student["id"] == student_id:
            # Créer un nouveau dictionnaire avec les données mises à jour
            updated_dict = updated_student.dict()
            updated_dict["id"] = student_id
            students_db[index] = updated_dict
            return updated_dict
    raise HTTPException(status_code=404, detail="Étudiant non trouvé")

# Route pour supprimer un étudiant
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    student = next((s for s in students_db if s['id'] == student_id), None)
    if student:
        students_db.remove(student)
        return {"message": f"Étudiant avec l'ID {student_id} supprimé"}
    raise HTTPException(status_code=404, detail="Étudiant non trouvé")

# Route racine pour tester l'API
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API de gestion des étudiants"}