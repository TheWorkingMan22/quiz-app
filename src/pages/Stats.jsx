import { useState } from 'react'
import { Card, Button, Row, Col, Table } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { getResults, clearResults } from '../utils/storage'

export default function Stats() {
  const [results, setResults] = useState(getResults())

  function handleClear() {
    clearResults()
    setResults([])
  }

  if (results.length === 0) {
    return (
      <Card className="mx-auto text-center shadow-sm" style={{ maxWidth: 500 }}>
        <Card.Body>
          <Card.Title as="h1" className="h3">No games yet</Card.Title>
          <p>Finish a quiz and your scores will show up here.</p>
        </Card.Body>
      </Card>
    )
  }

  const percentages = results.map((r) => Math.round((r.score / r.total) * 100))
  const best = Math.max(...percentages)
  const average = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length)

  const chartData = results.map((r, i) => ({
    game: i + 1,
    percent: percentages[i],
  }))
  return (
    <div>
      <h1 className="h3 mb-4">Your stats</h1>

      <Row className="g-3 mb-4">
        <Col xs={12} sm={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div className="text-muted">Games played</div>
              <div className="display-6">{results.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div className="text-muted">Best score</div>
              <div className="display-6">{best}%</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} sm={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <div className="text-muted">Average</div>
              <div className="display-6">{average}%</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title as="h2" className="h5">Score per game</Card.Title>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="percent" stroke="#0d6efd" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      <Table striped responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={r.date}>
              <td>{i + 1}</td>
              <td>{new Date(r.date).toLocaleString()}</td>
              <td>{r.score} / {r.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="outline-danger" onClick={handleClear}>
        <FaTrash className="me-1" /> Clear history
      </Button>
    </div>
  )
}
