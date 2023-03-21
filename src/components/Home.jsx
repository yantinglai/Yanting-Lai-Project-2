import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="Main">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <button
        class="my-button"
        onClick={function () {
          navigate('/');
        }}
      >
        Home
      </button>
      <button
        class="my-button"
        onClick={function () {
          navigate('/rules');
        }}
      >
        Rules
      </button>
      <button
        class="my-button"
        onClick={function () {
          navigate('/normal');
        }}
      >
        Easy
      </button>
      <button
        class="my-button"
        onClick={function () {
          navigate('/hard');
        }}
      >
        Hard
      </button>
    </div>
  );
}

export default Home;
