"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [students, setStudents] = useState<{ id: number; name: string; age: number; email: string }[]>([]);
  const [newStudent, setNewStudent] = useState({ name: "", age: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = "http://localhost:8000/students";

  // Charger les étudiants au démarrage
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8000/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants:", error);
        setError("Erreur de chargement des étudiants.");
      }
    };
    fetchStudents();
  }, []);

  // Ajouter un étudiant
  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newStudent.name || !newStudent.age || !newStudent.email) {
      setError("Veuillez remplir tous les champs !");
      return;
    }

    try {
      setLoading(true);
      const studentToAdd = { ...newStudent, age: Number(newStudent.age) };
      const response = await fetch("http://localhost:8000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentToAdd),
      });
      const data = await response.json();
      setStudents([...students, data]);
      setNewStudent({ name: "", age: "", email: "" });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      setError("Échec de l'ajout. Vérifiez les informations.");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un étudiant
  const deleteStudent = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${"http://localhost:8000/students"}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setStudents(students.filter((student) => student.id !== id));
      } else {
        setError("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Échec de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Liste des Étudiants</h1>

      {/* Affichage des étudiants */}
      {students.length > 0 ? (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
              <span>{student.name} ({student.age} ans) - {student.email}</span>
              <button onClick={() => deleteStudent(student.id)} disabled={loading} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition">
                ❌
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Aucun étudiant pour le moment.</p>
      )}

      {/* Formulaire d'ajout */}
      <h2 className="text-xl font-semibold mt-6">Ajouter un étudiant</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={addStudent} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Âge</label>
          <input type="number" value={newStudent.age} onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="w-full p-2 border rounded-md" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          {loading ? "Ajout..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
