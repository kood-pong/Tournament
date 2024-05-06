import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import MainPage from './components/MainLeaderboard';
import Error from './components/Error';
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
import { AuthProvider } from './components/contexts/AuthContext';
import SetsCounter from "./components/SetsCounter";

const PORT: string = 'http://localhost:7080'

function App() {

  return (
    <AuthProvider PORT={PORT}>
      <div className="App">
        {/* <p>Text</p> */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={<Authentication isLogin={true} PORT={PORT} />
              } />
            <Route
              path="/signup"
              element={<Authentication isLogin={false} PORT={PORT} />
              } />
            <Route
              path="/"
              element={
                <MainPage PORT={PORT} />
              } />
            <Route
              path='/calendar'
              element={
                <Calendar PORT={PORT} />
              } />
            <Route // authorised
              path='/user/:id'
              element={
                <Profile PORT={PORT} />
              } />
            <Route
              path='/tournament/:id'
              element={
                <Tournament PORT={PORT} />
              } />
            <Route // only for admin
              path='/requests'
              element={
                <Requests PORT={PORT} />
              }
            />
            <Route // only for admin
              path='/create-tournament'
              element={
                <CreateTournament PORT={PORT} />
              }
            />
            <Route // only for admin
              path='/tournament/:tid/set-up'
              element={
                <TournamentSetUp PORT={PORT} />
              }
            />
            <Route // only for admin
              path='/tournament/:tid/matches'
              element={
                <Matches PORT={PORT} />
              }
            />
            <Route // only for admin
              path='/tournament/:tid/match/:id/sets'
              element={
                // <Sets PORT={PORT} />
                <SetsCounter />
              } />
            <Route
              path='/error/:status'
              element={
                <Error PORT={PORT} />
              } />
            <Route path='*' element={<Navigate to={"/"} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
