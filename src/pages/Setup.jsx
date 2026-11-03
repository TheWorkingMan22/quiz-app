import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap'
import { FaPlay, FaRedo } from 'react-icons/fa'

const CATEGORIES_URL = 'https://opentdb.com/api_category.php'

export default function Setup() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [amount, setAmount] = useState(10)

  async function loadCategories(signal) {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(CATEGORIES_URL, { signal })
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`)
      }
      const data = await response.json()
      setCategories(data.trivia_categories)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Could not load categories.')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadCategories(controller.signal)
    return () => controller.abort()
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/quiz', { state: { category, difficulty, amount } })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading categories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Something went wrong</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => loadCategories()}>
          <FaRedo className="me-1" /> Try again
        </Button>
      </Alert>
    )
  }

  return (
    <Card className="mx-auto shadow-sm" style={{ maxWidth: 500 }}>
      <Card.Body>
        <Card.Title as="h1" className="h3 mb-4">Set up your quiz</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Any category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="difficulty">
            <Form.Label>Difficulty</Form.Label>
            <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4" controlId="amount">
            <Form.Label>Number of questions: {amount}</Form.Label>
            <Form.Range
              min={5}
              max={20}
              step={5}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            <FaPlay className="me-1" /> Start quiz
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
