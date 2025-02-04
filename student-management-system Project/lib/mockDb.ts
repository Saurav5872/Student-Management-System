interface Student {
  id: string
  name: string
  class: string
  section: string
  rollNumber: string
  [key: string]: string
}

let students: Student[] = []

export const mockDb = {
  collection: (collectionName: string) => ({
    add: (data: Omit<Student, "id">): Promise<{ id: string }> => {
      return new Promise((resolve) => {
        const newStudent = { ...data, id: Date.now().toString() }
        students.push(newStudent)
        resolve({ id: newStudent.id })
      })
    },
    get: (): Promise<{ docs: { id: string; data: () => Student }[] }> => {
      return new Promise((resolve) => {
        resolve({
          docs: students.map((student) => ({
            id: student.id,
            data: () => student,
          })),
        })
      })
    },
  }),
  doc: (collectionName: string, id: string) => ({
    delete: (): Promise<void> => {
      return new Promise((resolve) => {
        students = students.filter((student) => student.id !== id)
        resolve()
      })
    },
  }),
}

