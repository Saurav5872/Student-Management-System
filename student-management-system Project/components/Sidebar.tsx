import Link from "next/link"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const router = useRouter()

  const handleLogout = async () => {
    await auth.signOut()
    router.push("/")
  }

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/students">
              <Button variant="ghost" className="w-full justify-start">
                Students
              </Button>
            </Link>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

