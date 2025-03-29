import React from 'react';
import Login from './Components/Auth/Login';
import SideBar from './Components/SideBar/SideBar';

function App() {
  return (
    <div className="app-container">
      {/* <div className="login-container">
        <Login />
      </div> */}
      <SideBar/>
    </div>
  );
}

export default App;
