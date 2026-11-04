const KEY = 'quiz-results'

export function getResults() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveResult(result) {
  try {
    const results = getResults()
    results.push(result)
    localStorage.setItem(KEY, JSON.stringify(results))
  } catch {
    // storage unavailable: ignore, the quiz still works
  }
}

export function clearResults() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
