import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import MainPage from './components/MainLeaderboard';
import Calendar from './components/Calendar';
import Profile from './components/Profile';
import Tournament from './components/Tournament';
import CreateTournament from './components/CreateTournament';
import TournamentSetUp from './components/TournamentSetUp';
import Matches from './components/Matches';
import Sets from './components/Sets';
import Requests from "./components/Requests";
import { useState } from "react";
import Authentication from "./components/Authentication/Authentication";

const PORT: string = 'http://localhost:7080'

function App() {

  return (
    <div className="App">
      {/* <p>Text</p> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Authentication isLogin={true} />
            } />
          <Route
            path="/signup"
            element={<Authentication isLogin={false} />
            } />
          <Route
            path="/"
            element={
              <MainPage PORT={PORT} />
            } />
          <Route
            path='/calendar'
            element={
              <Calendar />
            } />
          <Route // authorised
            path='/user/:id'
            element={
              <Profile />
            } />
          <Route
            path='/tournament/:id'
            element={
              <Tournament />
            } />
          <Route // only for admin
            path='/requests'
            element={
              <Requests />
            }
          />
          <Route // only for admin
            path='/create-tournament'
            element={
              <CreateTournament />
            }
          />
          <Route // only for admin
            path='/tournament/:id/set-up'
            element={
              <TournamentSetUp />
            }
          />
          <Route // only for admin
            path='/tournament/:id/matches'
            element={
              <Matches />
            }
          />
          <Route // only for admin
            path='/tournament/:id/match/:id/sets'
            element={
              <Sets />
            } />
          <Route path='*' element={<Navigate to={"/"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
