import UploadAudio from "./components/UploadAudio";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header/header";
function App() {
  return (
    <div className="app-container">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <LoginForm /> */}
      <Sidebar />
      <Header />
    </div>
  );
}

export default App;
