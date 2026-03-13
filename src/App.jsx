import { useEffect } from "react";
import useGameState from "./hooks/useGameState";
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import RoundResult from "./components/RoundResult";
import GameOver from "./components/GameOver";

export default function App() {
  const {
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
    startGame,
    placeGuess,
    confirmGuess,
    nextRound,
    goHome,
    IMAGE_SIZE,
    GAME_MODES,
  } = useGameState();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (phase === "playing" && guessPosition && !confirmed) {
          e.preventDefault();
          confirmGuess();
        } else if (phase === "result") {
          e.preventDefault();
          nextRound();
        }
      }
      if (e.key === "Escape") {
        if (phase === "playing" || phase === "result") {
          goHome();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, guessPosition, confirmed, confirmGuess, nextRound, goHome]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Header
        phase={phase}
        totalScore={totalScore}
        currentRound={currentRound}
        totalRounds={totalRounds}
        onHome={goHome}
      />

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Home screen */}
        {phase === "home" && (
          <HomeScreen onStart={startGame} gameModes={GAME_MODES} />
        )}

        {/* Playing */}
        {(phase === "playing" || phase === "result") && (
          <GameScreen
            currentLocation={currentLocation}
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            maxTime={modeConfig?.timePerRound}
            guessPosition={guessPosition}
            confirmed={confirmed}
            onMapClick={(lat, lng) => placeGuess(lat, lng)}
            onConfirm={confirmGuess}
          />
        )}

        {/* Round result overlay */}
        {phase === "result" && roundResult && (
          <RoundResult
            roundResult={roundResult}
            guessPosition={guessPosition}
            currentLocation={currentLocation}
            onNext={nextRound}
            isLastRound={currentRound >= totalRounds - 1}
          />
        )}

        {/* Game over */}
        {phase === "gameover" && (
          <GameOver
            totalScore={totalScore}
            roundHistory={roundHistory}
            totalRounds={totalRounds}
            onPlayAgain={() => startGame(mode)}
            onHome={goHome}
          />
        )}
      </div>
    </div>
  );
}