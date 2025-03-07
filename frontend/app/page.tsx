"use client";

import { useEffect, useState } from 'react';

// Définition du type Student pour éviter les erreurs TypeScript
interface Student {
  id: number;
  name: string;
  age: number;
  major: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [major, setMajor] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Récupérer la liste des étudiants au chargement de la page
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.error("Erreur lors de la récupération des étudiants");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };
    
    fetchStudents();
  }, []);

  // Ajouter un nouvel étudiant
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de l'âge
    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue <= 0) {
      console.error("L'âge doit être un nombre positif");
      return;
    }
    
    const newStudent = { name, age: ageValue, major };

    try {
      const response = await fetch('http://127.0.0.1:8000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const addedStudent: Student = await response.json();
        // S'assurer que addedStudent a un champ id
        if (addedStudent && addedStudent.id) {
          setStudents((prevStudents) => [...prevStudents, addedStudent]);
          // Réinitialiser le formulaire
          resetForm();
        } else {
          console.error("Étudiant ajouté mais sans ID valide");
        }
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de l'ajout de l'étudiant :", error);
    }
  };

  // Supprimer un étudiant
  const handleDeleteStudent = async (id: number) => {
    if (!id) {
      console.error("ID d'étudiant invalide");
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression de l'étudiant :", error);
    }
  };

  // Mettre à jour un étudiant
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStudent || !editingStudent.id) {
      console.error("Aucun étudiant en cours d'édition ou ID manquant");
      return;
    }
    
    // Validation de l'âge
    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue <= 0) {
      console.error("L'âge doit être un nombre positif");
      return;
    }
    
    const updatedStudent = { 
      id: editingStudent.id, 
      name, 
      age: ageValue, 
      major 
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudent),
      });

      if (response.ok) {
        const updatedStudentData: Student = await response.json();
        if (updatedStudentData && updatedStudentData.id) {
          setStudents((prevStudents) => 
            prevStudents.map((s) => 
              s.id === updatedStudentData.id ? updatedStudentData : s
            )
          );
          // Réinitialiser le formulaire et l'état d'édition
          resetForm();
        } else {
          console.error("Données d'étudiant mises à jour mais invalides");
        }
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour de l'étudiant :", errorData);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la mise à jour de l'étudiant :", error);
    }
  };

  // Remplir le formulaire avec les données de l'étudiant à modifier
  const startEditing = (student: Student) => {
    if (!student || !student.id) {
      console.error("Étudiant invalide");
      return;
    }
    
    setEditingStudent(student);
    setName(student.name || '');
    setAge(student.age?.toString() || '');
    setMajor(student.major || '');
  };
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingStudent(null);
    setName('');
    setAge('');
    setMajor('');
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Liste des étudiants</h1>
      
      {students.length === 0 ? (
        <p className="text-white italic">Aucun étudiant trouvé. Ajoutez-en un pour commencer.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li
              key={student.id}
              className="mb-3 p-4 border border-gray-300 rounded-lg shadow-sm flex justify-between items-center bg-gray-800 bg-opacity-50"
            >
              <div>
                <strong className="text-lg text-white">{student.name}</strong>
                <span className="text-gray-300"> - {student.age} ans - {student.major}</span>
              </div>
              <div className="flex">
                <button
                  onClick={() => student && student.id && startEditing(student)}
                  className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => student && student.id && handleDeleteStudent(student.id)}
                  className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  aria-label={`Supprimer ${student.name}`}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
  
      <h2 className="text-xl font-bold mt-8 mb-4 text-white">
        {editingStudent ? "Modifier un étudiant" : "Ajouter un étudiant"}
      </h2>
      
      <form
        onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
        className="flex flex-col gap-3 max-w-md"
      >
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 rounded border border-gray-300 text-base bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min="1"
          className="p-3 rounded border border-gray-300 text-base bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Majeure"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
          className="p-3 rounded border border-gray-300 text-base bg-gray-700 text-white placeholder-gray-400"
        />
        
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded text-base transition-colors"
          >
            {editingStudent ? "Mettre à jour" : "Ajouter"}
          </button>
          
          {editingStudent && (
            <button
              type="button"
              onClick={resetForm}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded text-base transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}