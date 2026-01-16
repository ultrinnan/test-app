import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div>App is running!</div>} />
      </Routes>
    </div>
  )
}

export default App
