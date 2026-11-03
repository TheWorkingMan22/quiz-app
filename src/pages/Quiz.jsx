import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Card, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap'
import { FaRedo } from 'react-icons/fa'
import { decode } from 'he'

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildUrl({ category, difficulty, amount }) {
  const params = new URLSearchParams({ amount: String(amount), type: 'multiple' })
  if (category) params.set('category', category)
  if (difficulty) params.set('difficulty', difficulty)
  return `https://opentdb.com/api.php?${params.toString()}`
}

export default function Quiz() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  async function loadQuestions(signal) {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(buildUrl(state), { signal })
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait 5 seconds and try again.')
      }
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }
      const data = await response.json()
      if (data.response_code === 1) {
        throw new Error('Not enough questions for this choice. Try another category or fewer questions.')
      }
      if (data.response_code === 5) {
        throw new Error('Too many requests. Please wait 5 seconds and try again.')
      }
      if (data.response_code !== 0) {
        throw new Error('The quiz service returned an error. Please try again.')
      }
      const prepared = data.results.map((q) => ({
        text: decode(q.question),
        correct: decode(q.correct_answer),
        answers: shuffle([q.correct_answer, ...q.incorrect_answers].map((a) => decode(a))),
      }))
      setQuestions(prepared)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Could not load questions.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    if (!state) return
    const controller = new AbortController()
    loadQuestions(controller.signal)
    return () => controller.abort()
  }, [])

  function handleAnswer(answer) {
    if (selected !== null) return
    setSelected(answer)
    if (answer === questions[index].correct) setScore(score + 1)
  }

  function handleNext() {
    setSelected(null)
    setIndex(index + 1)
  }
  if (!state) {
    return (
      <p>
        No quiz set up yet. <Link to="/">Go to Setup</Link>
      </p>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Something went wrong</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" className="me-2" onClick={() => loadQuestions()}>
          <FaRedo className="me-1" /> Try again
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to setup
        </Button>
      </Alert>
    )
  }

  if (index >= questions.length) {
    return (
      <Card className="mx-auto text-center shadow-sm" style={{ maxWidth: 500 }}>
        <Card.Body>
          <Card.Title as="h1" className="h3">Quiz finished</Card.Title>
          <p className="display-4">{score} / {questions.length}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Play again
          </Button>
        </Card.Body>
      </Card>
    )
  }

  const current = questions[index]

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 600 }}>
      <Card.Body>
        <p className="text-muted mb-1">
          Question {index + 1} of {questions.length} | Score: {score}
        </p>
        <ProgressBar now={(index / questions.length) * 100} className="mb-3" />
        <Card.Title as="h1" className="h4 mb-4">{current.text}</Card.Title>

        <div className="d-grid gap-2">
          {current.answers.map((answer) => {
            let variant = 'outline-primary'
            if (selected !== null) {
              if (answer === current.correct) variant = 'success'
              else if (answer === selected) variant = 'danger'
              else variant = 'outline-secondary'
            }
            return (
              <Button
                key={answer}
                variant={variant}
                disabled={selected !== null}
                onClick={() => handleAnswer(answer)}
              >
                {answer}
              </Button>
            )
          })}
        </div>

        {selected !== null && (
          <Button variant="dark" className="mt-4 w-100" onClick={handleNext}>
            {index + 1 === questions.length ? 'See results' : 'Next question'}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
