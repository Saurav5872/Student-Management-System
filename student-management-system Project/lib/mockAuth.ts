interface User {
  email: string
  password: string
}

const mockUser: User = {
  email: "admin@123.com",
  password: "admin@123",
}

let currentUser: User | null = null

export const mockAuth = {
  signInWithEmailAndPassword: (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (email === mockUser.email && password === mockUser.password) {
        currentUser = mockUser
        resolve()
      } else {
        reject(new Error("Invalid credentials"))
      }
    })
  },
  signOut: (): Promise<void> => {
    return new Promise((resolve) => {
      currentUser = null
      resolve()
    })
  },
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    callback(currentUser)
    return () => {} // Return a cleanup function
  },
}

