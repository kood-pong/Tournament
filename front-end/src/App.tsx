import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainPage from './components/MainPage';

const PORT: string = 'http://localhost:7080';

function App() {
  return (
    <div className="App">
      <MainPage PORT = {PORT}/>
    </div>
  );
}

export default App;
