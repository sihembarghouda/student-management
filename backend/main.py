from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from models import Student as DBStudent, Base
from database import engine, get_db

app = FastAPI()

# Activation de CORS pour autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer toutes les tables de la base de données au démarrage
@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)

# Modèle étudiant pour l'API
class Student(BaseModel):
    id: Optional[int] = None  # ID optionnel (géré côté backend)
    name: str
    age: int
    email: str

# Récupérer tous les étudiants
@app.get("/students", response_model=List[Student])
def get_students(db: Session = Depends(get_db)):
    students = db.query(DBStudent).all()
    return students

# Ajouter un étudiant
@app.post("/students", response_model=Student)
def add_student(student: Student, db: Session = Depends(get_db)):
    # Vérifier si un étudiant avec le même email existe déjà
    existing_student = db.query(DBStudent).filter(DBStudent.email == student.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Un étudiant avec cet email existe déjà.")
    
    db_student = DBStudent(name=student.name, age=student.age, email=student.email)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# Supprimer un étudiant
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(DBStudent).filter(DBStudent.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
        return {"message": "Étudiant supprimé avec succès"}
    else:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
