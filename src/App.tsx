import './App.css'
import AppShell from './core/layout/AppShell/AppShell'
import Dashboard from './core/pages/DashboardPage/Dashboard'

function App() {
  return (
    <AppShell>
      <Dashboard/>
    </AppShell>
  )
}

export default App