import { useEffect, useState } from "react";
import useGameState from "./hooks/useGameState";
import { useSound, getSoundEnabled, setSoundEnabled } from "./hooks/useSound";
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import RoundResult from "./components/RoundResult";
import GameOver from "./components/GameOver";
import SettingsPanel from "./components/SettingsPanel";

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

  // Sound preferences
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled);
  const { playClick, playConfirm, playScore, playTimeout } = useSound(soundEnabled);

  const toggleSound = () => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  };

  // Settings panel visibility
  const [showSettings, setShowSettings] = useState(false);

  // Compute the actual position on the map for the result overlay
  const actualPosition =
    currentLocation
      ? [currentLocation.y * IMAGE_SIZE, currentLocation.x * IMAGE_SIZE]
      : null;

  // Play sounds in response to game events
  useEffect(() => {
    if (roundResult) {
      if (roundResult.timedOut) {
        playTimeout();
      } else {
        playScore(roundResult.score);
      }
    }
  }, [roundResult, playTimeout, playScore]);

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
        if (showSettings) {
          setShowSettings(false);
        } else if (phase === "playing" || phase === "result") {
          goHome();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, guessPosition, confirmed, showSettings, confirmGuess, nextRound, goHome]);

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
          <HomeScreen
            onStart={startGame}
            gameModes={GAME_MODES}
            onSettings={() => setShowSettings(true)}
          />
        )}

        {/* Playing + result share the same GameScreen so the map isn't remounted */}
        {(phase === "playing" || phase === "result") && (
          <GameScreen
            currentLocation={currentLocation}
            currentRound={currentRound}
            totalRounds={totalRounds}
            timeLeft={timeLeft}
            maxTime={modeConfig?.timePerRound}
            guessPosition={guessPosition}
            confirmed={confirmed}
            showResult={phase === "result"}
            actualPosition={phase === "result" ? actualPosition : null}
            onMapClick={(lat, lng) => {
              placeGuess(lat, lng);
              playClick();
            }}
            onConfirm={() => {
              confirmGuess();
              playConfirm();
            }}
          />
        )}

        {/* Round result bottom-bar overlay */}
        {phase === "result" && roundResult && (
          <RoundResult
            roundResult={roundResult}
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
            mode={mode}
            onPlayAgain={() => startGame(mode)}
            onHome={goHome}
          />
        )}
      </div>

      {/* Settings modal */}
      {showSettings && (
        <SettingsPanel
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}