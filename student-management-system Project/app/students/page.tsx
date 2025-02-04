"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash } from "lucide-react"
import AddStudentModal from "@/components/AddStudentModal"
import Sidebar from "@/components/Sidebar"

interface Student {
  id: string
  name: string
  class: string
  section: string
  rollNumber: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/")
      }
    })

    fetchStudents()

    return () => unsubscribe()
  }, [router])

  const fetchStudents = async () => {
    const querySnapshot = await db.collection("students").get()
    const studentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[]
    setStudents(studentsData)
  }

  const handleAddStudent = async (studentData: Omit<Student, "id">) => {
    await db.collection("students").add(studentData)
    fetchStudents()
    setIsModalOpen(false)
  }

  const handleDeleteStudent = async (id: string) => {
    await db.doc("students", id).delete()
    fetchStudents()
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        <Button onClick={() => setIsModalOpen(true)} className="mb-4">
          Add Student
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddStudent} />
      </div>
    </div>
  )
}

