import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import UserRegistration from './components/UserRegistration';
import UserList from './components/UserList';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>用户管理系统</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<UserRegistration />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
