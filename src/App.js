import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
import './App.css';
import { CLIENT_ID, API_KEY } from './API_Config';
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function App() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loginEmail, setLoginEmail ] = useState('');
  const [ loginPassword, setLoginPassword ] = useState('');
  const [ loggedin, setLoggedin ] = useState(false);

  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

  useEffect(() => {
    // auth.onAuthStateChanged(setUser);

    // return () => auth.onAuthStateChanged(setUser);

    // window.gapi.auth2.getAuthInstance().isSignedIn.listen(setUser)

    // return () => window.gapi.auth2.getAuthInstance().isSignedIn.listen(setUser)
    window.gapi.load('client:auth2', initClient);
  }, [])

  const setUser = (user) => {
    user ? setLoggedin(true) : setLoggedin(false);
  }

  const createUser = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password);

    setEmail('');
    setPassword('');
  }

  const logout = () => {
    // auth.signOut();
    window.gapi.auth2.getAuthInstance().signOut();
  }

  const login = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(loginEmail, loginPassword);
    setLoginEmail('');
    setLoginPassword('');
  }

  const googleAuth = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  const initClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .catch(err => {
      console.log(err)    
    })
  }

  const getEvents = () => {
    window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })
    .then(function (response) {
      var events = response.result.items;

      console.log(events);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const postEvent = () => {
    const event = {
      summary: 'Successful Post!!!',
      location: 'Galvanize',
      description: 'this is the description',
      start: {
        dateTime: '2020-02-06T09:00:00-07:00',
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: '2020-02-06T10:00:00-07:00',
        timeZone: 'America/Los_Angeles'
      },
      attendees: [
        { 'email': 'jeff.salinas.js@gmail.com' }
      ]
    };

    var request = window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    request.execute(function (newEvent) {
      console.log('Event created: ' + newEvent.htmlLink);
    });
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

      <button onClick={googleAuth}>Sign in With Google</button>
      <button onClick={getEvents}>Get Events</button>
      <button onClick={postEvent}>Post Event</button>
    </div>
  );
}

export default App;
