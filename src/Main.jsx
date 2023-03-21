import React from 'react';
import './Main.css';
import Board from './components/Normal/Board';
import HardBoard from './components/Hard/hardBoard';
import Keyboard from './components/Keyboard';
import { createContext, useState } from 'react';
import { initialNormal, createWordSet } from './components/Normal/Words';
import { initialHard, createHardWordSet } from './components/Hard/hardWords';
import EndOfGame from './components/Normal/EndOfGame';
import EndOfGameHard from './components/Hard/EndOfGameHard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const AppContext = createContext();

function Main(props) {
  const [normalBoard, setnormalBoard] = useState(initialNormal);
  const [hardBoard, sethardBoard] = useState(initialHard);

  const [curAttempt, setCurAttempt] = useState({ attempt: 0, position: 0 });

  const [wordSet, setWordSet] = useState(new Set());
  const [hardWordSet, setHardWordSet] = useState(new Set());

  const [eliminatedLetters, setEliminatedLetters] = useState([]);

  const [answer, setAnswer] = useState('');
  const [hardAnswer, setHardAnswer] = useState('');

  const [endOfGame, setEndOfGame] = useState({
    gameOver: false,
    gotAnswer: false,
  });

  useEffect(() => {
    if (props.hard === true) {
      createHardWordSet().then((hardWords) => {
        setHardWordSet(hardWords.hardWordSet);
        setHardAnswer(hardWords.randomHardWord);
      });
    } else {
      createWordSet().then((words) => {
        setWordSet(words.wordSet);
        setAnswer(words.randomWord);
      });
    }
  }, []);

  // Select hard or easy mode
  const onSelect = (keyValue) => {
    // clear the error message each time when user enter a new value
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    if (props.hard === true) {
      if (curAttempt.position > 6) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Word too long!';
        return;
      }
      const updatedBoard = [...hardBoard];
      updatedBoard[curAttempt.attempt][curAttempt.position] = keyValue;
      sethardBoard(updatedBoard);
      setCurAttempt({ ...curAttempt, position: curAttempt.position + 1 });
    } else {
      if (curAttempt.position > 5) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Word too long!';
        return;
      }
      const updatedBoard = [...normalBoard];
      updatedBoard[curAttempt.attempt][curAttempt.position] = keyValue;
      setnormalBoard(updatedBoard);
      setCurAttempt({ ...curAttempt, position: curAttempt.position + 1 });
    }
    if (keyValue === 'Enter') {
      const currentWord = props.hard
        ? hardBoard[curAttempt.attempt].join('')
        : normalBoard[curAttempt.attempt].join('');
      if (currentWord.length < 6 || (props.hard && currentWord.length < 7)) {
        errorMessage.textContent = 'Input too short'; // Display the error message
      }
    }
  };

  // Update the board when we delete words
  const onDelete = () => {
    if (props.hard === true) {
      if (curAttempt.position === 0) return;
      const updatedBoard = [...hardBoard];
      updatedBoard[curAttempt.attempt][curAttempt.position - 1] = '';
      sethardBoard(updatedBoard);
      setCurAttempt({ ...curAttempt, position: curAttempt.position - 1 });
    } else {
      if (curAttempt.position === 0) return;
      const updatedBoard = [...normalBoard];
      updatedBoard[curAttempt.attempt][curAttempt.position - 1] = '';
      setnormalBoard(updatedBoard);
      setCurAttempt({ ...curAttempt, position: curAttempt.position - 1 });
    }
  };

  const enterWord = () => {
    if (props.hard === true) {
      if (curAttempt.position !== 7) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Word too short!';
        return;
      }

      let currWord = '';
      for (let i = 0; i < 7; i++) {
        currWord += hardBoard[curAttempt.attempt][i];
      }
      if (currWord.length === 0) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please enter a word.';
        return;
      }

      if (hardWordSet.has(currWord.toLowerCase())) {
        setCurAttempt({ attempt: curAttempt.attempt + 1, position: 0 });
      } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please enter a valid word.';
        return;
      }

      if (currWord.toLowerCase() === hardAnswer) {
        setEndOfGame({ gameOver: true, gotAnswer: true });
        return;
      }

      if (curAttempt.attempt === 4) {
        setEndOfGame({ gameOver: true, gotAnswer: false });
      }
    } else {
      if (curAttempt.position !== 6) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Word too short!';
        return;
      }

      let currWord = '';
      for (let i = 0; i < 6; i++) {
        currWord += normalBoard[curAttempt.attempt][i];
      }

      if (wordSet.has(currWord.toLowerCase())) {
        setCurAttempt({ attempt: curAttempt.attempt + 1, position: 0 });
      } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Please enter a valid word.';
        return;
      }

      if (currWord.toLowerCase() === answer) {
        setEndOfGame({ gameOver: true, gotAnswer: true });
        return;
      }

      if (curAttempt.attempt === 5) {
        setEndOfGame({ gameOver: true, gotAnswer: false });
      }
    }
  };

  function restartGame() {
    window.location.reload(false);
  }

  const navigate = useNavigate();

  if (props.hard === true) {
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
        <AppContext.Provider
          value={{
            hardBoard,
            sethardBoard,
            curAttempt,
            setCurAttempt,
            onSelect,
            onDelete,
            enterWord,
            hardAnswer,
            setEliminatedLetters,
            eliminatedLetters,
            endOfGame,
            setEndOfGame,
          }}
        >
          <br></br> <br></br>
          <div id="error-message"></div>
          <div className="game">
            <HardBoard />
            <button class="my-button" onClick={restartGame}>
              RESET
            </button>
            {endOfGame.gameOver ? <EndOfGameHard /> : <Keyboard />}
          </div>
        </AppContext.Provider>
      </div>
    );
  }

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
      <AppContext.Provider
        value={{
          normalBoard,
          setnormalBoard,
          curAttempt,
          setCurAttempt,
          onSelect,
          onDelete,
          enterWord,
          answer,
          setEliminatedLetters,
          eliminatedLetters,
          endOfGame,
          setEndOfGame,
        }}
      >
        <br></br> <br></br>
        <div id="error-message"></div>
        <div className="game">
          <Board />
          <button class="my-button" onClick={restartGame}>
            RESET
          </button>
          {endOfGame.gameOver ? <EndOfGame /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default Main;
