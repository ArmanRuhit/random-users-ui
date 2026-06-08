import { useEffect, useState } from "react"

function App() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetch(`https://api.freeapi.app/api/v1/public/randomusers?page=${page}&limit=10`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load users (status ' + response.status + ')')
        }
        return response.json()
      })
      .then((result) => {
        setUsers(result.data.data)
        setTotalPages(result.data.totalPages)
      }).catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [page]);

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Loading…</p>
  }
  if (error) {
    return <p className="p-8 text-center text-red-600">{error}</p>
  }



  return (
    <div className='min-h-screen bg-slate-100 p-8' >
      <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Random Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow" key={user.login.uuid}>
            <img src={user.picture.medium} alt={user.name.first} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">
              {user.name.first} {user.name.last}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
            <p className="text-slate-500 text-sm mt-1">{user.location.city}, {user.location.country}</p>
            <p className="text-slate-500 text-sm mt-1">{user.phone}</p>
          </div>
        ))}
      </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={()=> setPage(page - 1)} disabled={page === 1} className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
          <p>Page {page} of {totalPages}</p>
          <button onClick={()=> setPage(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
        </div>
    </div>
  )
}

export default App
