import { useState } from 'react';
import service from './service';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      await service.login(username, password);
      onLogin();
    } catch {
      setError("שם משתמש או סיסמה שגויים");
    }
  }

  async function handleRegister() {
    try {
      await service.register(username, password);
      onLogin();
    } catch {
      setError("ההרשמה נכשלה, ייתכן ששם המשתמש כבר קיים");
    }
  }

  return (
    <div style={{ maxWidth: 300, margin: "50px auto", display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>התחברות</h2>
      <input placeholder="שם משתמש" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>התחברות</button>
      <button onClick={handleRegister}>הרשמה</button>
      
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default Login;