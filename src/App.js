import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import './App.css';
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function App() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loginEmail, setLoginEmail ] = useState('');
  const [ loginPassword, setLoginPassword ] = useState('');
  const [ loggedin, setLoggedin ] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(setUser)

    return () => auth.onAuthStateChanged(setUser)
  }, [])

  const setUser = (user) => {
    console.log(user);
    user ? setLoggedin(true) : setLoggedin(false);
  }

  const createUser = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)

    setEmail('');
    setPassword('');
  }

  const logout = () => {
    auth.signOut();
  }

  const login = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(loginEmail, loginPassword);
    setLoginEmail('');
    setLoginPassword('');
  }
  
  return (
    <div className="App">
      <div>
        Create User
        <form onSubmit={createUser} >
          <label>Email
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>Password
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div>
        Log In
        <form onSubmit={login} >
          <label>Email
            <input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
          </label>
          <label>Password
            <input type="text" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>

      <button onClick={logout}>Log Out</button>
      {loggedin && <p>Logged in!!!</p>}
    </div>
  );
}

export default App;
