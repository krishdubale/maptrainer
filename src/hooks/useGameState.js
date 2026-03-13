import { useState, useEffect, useCallback, useRef } from "react";
import { getRandomLocations } from "../data/locations";

/**
 * Game mode configurations
 */
const GAME_MODES = {
  classic: {
    name: "Classic",
    rounds: 5,
    timePerRound: 30,
    description: "5 rounds, 30 seconds each",
  },
  blitz: {
    name: "Blitz",
    rounds: 10,
    timePerRound: 10,
    description: "10 rounds, 10 seconds each — think fast!",
  },
  practice: {
    name: "Practice",
    rounds: 15,
    timePerRound: null, // no timer
    description: "No timer, all locations, learn at your pace",
  },
};

const IMAGE_SIZE = 8192;

/**
 * Calculate score based on distance between guess and actual location.
 * Max score = 1000, decreases with distance.
 * Also converts distance to approximate in-game meters.
 */
function calculateScore(guessX, guessY, actualX, actualY) {
  const dx = guessX - actualX;
  const dy = guessY - actualY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Erangel is ~8km x 8km, so normalized distance * 8000 = approx meters
  const distanceMeters = Math.round(distance * 8000);

  // Score: 1000 points max, lose points for every meter of distance
  // Within ~50m = nearly perfect (950+), >800m = 0
  const score = Math.max(0, Math.round(1000 * Math.exp(-distance * 6)));

  return { score, distanceMeters, distance };
}

/**
 * Get performance tier based on average score
 */
export function getTier(avgScore) {
  if (avgScore >= 900) return { tier: "S", label: "Conqueror", color: "score-s" };
  if (avgScore >= 700) return { tier: "A", label: "Ace", color: "score-a" };
  if (avgScore >= 500) return { tier: "B", label: "Crown", color: "score-b" };
  if (avgScore >= 300) return { tier: "C", label: "Platinum", color: "score-c" };
  return { tier: "D", label: "Bronze", color: "score-d" };
}

/**
 * Custom hook for full game state management
 */
export default function useGameState() {
  // Game phase: "home" | "playing" | "result" | "gameover"
  const [phase, setPhase] = useState("home");
  const [mode, setMode] = useState(null);
  const [locations, setLocations] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [guessPosition, setGuessPosition] = useState(null); // [lat, lng] on map
  const [guessNormalized, setGuessNormalized] = useState(null); // {x, y} normalized
  const [confirmed, setConfirmed] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [roundHistory, setRoundHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const timerRef = useRef(null);

  const currentLocation = locations[currentRound] || null;
  const modeConfig = mode ? GAME_MODES[mode] : null;
  const totalRounds = modeConfig?.rounds || 0;

  // --- Timer ---
  useEffect(() => {
    if (phase !== "playing" || !modeConfig?.timePerRound) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit with no guess (timeout)
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentRound, mode]);

  const handleTimeout = useCallback(() => {
    // If the player hasn't confirmed a guess, score 0
    if (!confirmed) {
      const result = {
        location: locations[currentRound],
        guessX: null,
        guessY: null,
        score: 0,
        distanceMeters: null,
        timedOut: true,
      };
      setRoundResult(result);
      setRoundHistory((prev) => [...prev, result]);
      setPhase("result");
    }
  }, [confirmed, currentRound, locations]);

  // --- Actions ---

  const startGame = useCallback((selectedMode) => {
    const config = GAME_MODES[selectedMode];
    const locs = getRandomLocations(config.rounds);

    setMode(selectedMode);
    setLocations(locs);
    setCurrentRound(0);
    setGuessPosition(null);
    setGuessNormalized(null);
    setConfirmed(false);
    setRoundResult(null);
    setRoundHistory([]);
    setTotalScore(0);
    setTimeLeft(config.timePerRound);
    setPhase("playing");
  }, []);

  const placeGuess = useCallback((lat, lng) => {
    if (confirmed || phase !== "playing") return;
    setGuessPosition([lat, lng]);
    setGuessNormalized({
      x: lng / IMAGE_SIZE,
      y: lat / IMAGE_SIZE,
    });
  }, [confirmed, phase]);

  const confirmGuess = useCallback(() => {
    if (!guessNormalized || confirmed || !currentLocation) return;

    clearInterval(timerRef.current);
    setConfirmed(true);

    const { score, distanceMeters } = calculateScore(
      guessNormalized.x,
      guessNormalized.y,
      currentLocation.x,
      currentLocation.y
    );

    const result = {
      location: currentLocation,
      guessX: guessNormalized.x,
      guessY: guessNormalized.y,
      score,
      distanceMeters,
      timedOut: false,
    };

    setRoundResult(result);
    setRoundHistory((prev) => [...prev, result]);
    setTotalScore((prev) => prev + score);
    setPhase("result");
  }, [guessNormalized, confirmed, currentLocation]);

  const nextRound = useCallback(() => {
    if (currentRound >= totalRounds - 1) {
      // Save best score
      const best = localStorage.getItem("bgmi_best_score");
      const finalScore = totalScore;
      if (!best || finalScore > parseInt(best)) {
        localStorage.setItem("bgmi_best_score", finalScore.toString());
      }
      // Increment games played
      const played = parseInt(localStorage.getItem("bgmi_games_played") || "0");
      localStorage.setItem("bgmi_games_played", (played + 1).toString());

      setPhase("gameover");
    } else {
      setCurrentRound((prev) => prev + 1);
      setGuessPosition(null);
      setGuessNormalized(null);
      setConfirmed(false);
      setRoundResult(null);
      setTimeLeft(modeConfig?.timePerRound || null);
      setPhase("playing");
    }
  }, [currentRound, totalRounds, totalScore, modeConfig]);

  const goHome = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("home");
    setMode(null);
    setLocations([]);
    setCurrentRound(0);
    setGuessPosition(null);
    setGuessNormalized(null);
    setConfirmed(false);
    setRoundResult(null);
    setRoundHistory([]);
    setTotalScore(0);
    setTimeLeft(null);
  }, []);

  return {
    // State
    phase,
    mode,
    modeConfig,
    currentLocation,
    currentRound,
    totalRounds,
    timeLeft,
    guessPosition,
    guessNormalized,
    confirmed,
    roundResult,
    roundHistory,
    totalScore,

    // Actions
    startGame,
    placeGuess,
    confirmGuess,
    nextRound,
    goHome,

    // Constants
    IMAGE_SIZE,
    GAME_MODES,
  };
}
