import { useLocation, Link } from 'react-router-dom'

export default function Quiz() {
  const { state } = useLocation()

  if (!state) {
    return (
      <p>
        No quiz set up yet. <Link to="/">Go to Setup</Link>
      </p>
    )
  }

  return (
    <div>
      <h1>Quiz</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}
