/**
 * Snake Game React Component for OpenHD Easter Egg
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './SnakeGame.module.css';

interface Position {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame(): React.JSX.Element {
  const isBrowser = useIsBrowser();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  // Load high score from localStorage
  useEffect(() => {
    if (isBrowser) {
      const savedHighScore = localStorage.getItem('openhd-snake-high-score');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, [isBrowser]);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, []);

  // Start game
  const startGame = useCallback(() => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    } else if (gameOver) {
      resetGame();
      setIsPlaying(true);
    }
  }, [isPlaying, gameOver, resetGame]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        // Move head
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 1;
            const newHighScore = Math.max(newScore, highScore);
            setHighScore(newHighScore);
            if (isBrowser) {
              localStorage.setItem('openhd-snake-high-score', newHighScore.toString());
            }
            return newScore;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, direction, food, generateFood, highScore, isBrowser]);

  // Handle keyboard input
  useEffect(() => {
    if (!isBrowser) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.key === ' ') {
        startGame();
        return;
      }
      
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setDirection(current => current.y !== 1 ? { x: 0, y: -1 } : current);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setDirection(current => current.y !== -1 ? { x: 0, y: 1 } : current);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setDirection(current => current.x !== 1 ? { x: -1, y: 0 } : current);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setDirection(current => current.x !== -1 ? { x: 1, y: 0 } : current);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isBrowser, isPlaying, gameOver, startGame]);

  // Handle touch controls
  const handleDirectionClick = (newDirection: Direction) => {
    if (!isPlaying) return;
    setDirection(newDirection);
  };

  // Render game board
  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        let cellClass = styles.cell;
        
        // Check if this cell contains the snake head
        if (snake[0] && snake[0].x === x && snake[0].y === y) {
          cellClass += ` ${styles.snakeHead}`;
        }
        // Check if this cell contains snake body
        else if (snake.slice(1).some(segment => segment.x === x && segment.y === y)) {
          cellClass += ` ${styles.snakeBody}`;
        }
        // Check if this cell contains food
        else if (food.x === x && food.y === y) {
          cellClass += ` ${styles.food}`;
        }

        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    return board;
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameInfo}>
        <div className={styles.score}>
          <span>Score: {score}</span>
        </div>
        <div className={styles.highScore}>
          <span>High Score: {highScore}</span>
        </div>
      </div>

      <div className={styles.gameBoard}>
        {renderBoard()}
      </div>

      {!isPlaying && !gameOver && (
        <div className={styles.startScreen}>
          <button 
            className={styles.startButton}
            onClick={startGame}
          >
            <i className="fas fa-play"></i> Start Game
          </button>
          <p className={styles.instructions}>
            Use arrow keys to control the snake
          </p>
        </div>
      )}

      {gameOver && (
        <div className={styles.gameOverScreen}>
          <h3>Game Over!</h3>
          <p>Final Score: {score}</p>
          {score === highScore && score > 0 && (
            <p className={styles.newRecord}>🎉 New High Score! 🎉</p>
          )}
          <button 
            className={styles.restartButton}
            onClick={startGame}
          >
            <i className="fas fa-redo"></i> Play Again
          </button>
        </div>
      )}

      {/* Mobile touch controls */}
      <div className={styles.touchControls}>
        <div className={styles.controlRow}>
          <button 
            className={styles.controlButton}
            onClick={() => handleDirectionClick({ x: 0, y: -1 })}
            disabled={!isPlaying}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </div>
        <div className={styles.controlRow}>
          <button 
            className={styles.controlButton}
            onClick={() => handleDirectionClick({ x: -1, y: 0 })}
            disabled={!isPlaying}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <button 
            className={styles.controlButton}
            onClick={() => handleDirectionClick({ x: 1, y: 0 })}
            disabled={!isPlaying}
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        <div className={styles.controlRow}>
          <button 
            className={styles.controlButton}
            onClick={() => handleDirectionClick({ x: 0, y: 1 })}
            disabled={!isPlaying}
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </div>
  );
}