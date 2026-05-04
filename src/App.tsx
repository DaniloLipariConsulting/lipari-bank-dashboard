import "./App.css";
import AppShell from "./core/layout/AppShell/AppShell";
import Dashboard from "./core/pages/DashboardPage/Dashboard";
import { ThemeProvider } from "./store/auth/theme/ThemeContext";
import { AuthProvider } from "./store/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppShell>
          <Dashboard />
        </AppShell>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
