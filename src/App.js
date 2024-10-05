import logo from './logo.svg';
import './App.css';
import Three from './Three';

function App() {
  return (
    <div className="App">
      <button
        class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
        Button
      </button>
      <Three />
    </div>
  );
}

export default App;
