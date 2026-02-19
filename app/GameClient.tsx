'use client'

import { useState, useEffect } from "react";
import { GameProvider } from "./context/GameContext";
import { Phrase } from "./_components/Phrase";
import { NextPhaseButton } from "./_components/NextPhaseButton";
import { Modal } from "./_components/Modal";
import { RulesModal } from "./_components/RulesModal";
import { useGame } from "./hooks/useGame";

function GameInner({ onNextPhase, isLastPhase }: { onNextPhase: () => void; isLastPhase: boolean }) {
  const { isPhraseComplete, isTypedPhraseEqual, areAllInputsCorrect, letterStatuses } = useGame();
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    // prefere checagem baseada no status dos GameInput
    const result = areAllInputsCorrect();
    console.log("[GameClient] areAllInputsCorrect ->", result);
    setShowNextButton(result);
  }, [letterStatuses]);

  return (
    <>
      <Phrase />
      <Modal open={showNextButton} closeOnBackdrop={false}>
        <NextPhaseButton
          onNextPhase={() => {
            setShowNextButton(false)
            onNextPhase()
          }}
          isLastPhase={isLastPhase}
        />
      </Modal>
    </>
  );
}

export default function GameClient({ phrases }: { phrases: string[] }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const phrase = phrases[currentPhase];

  useEffect(() => {
    if (typeof window === "undefined") return
    const seen = localStorage.getItem('seenRules')
    if (!seen) {
      setShowRules(true)
    }
  }, [])
 
  // restaura fase salva no localStorage ao carregar
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = localStorage.getItem('savedPhase')
      if (saved !== null) {
        const n = parseInt(saved, 10)
        if (!Number.isNaN(n) && n >= 0 && n < phrases.length) {
          setCurrentPhase(n)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [phrases.length])

  // salva fase atual sempre que mudar
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem('savedPhase', String(currentPhase))
    } catch {}
  }, [currentPhase])

  const handleNextPhase = () => {
    if (currentPhase < phrases.length - 1) {
      setCurrentPhase((p) => p + 1);
    }
  };

  return (
    <GameProvider phrase={phrase} key={currentPhase}>
      <div className="relative flex flex-col gap-6 items-center justify-center">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setShowRules(true)}
            className="px-3 py-2 bg-white/90 border border-purple-300 text-purple-700 rounded-lg shadow-sm hover:bg-white transition"
          >
            Dúvidas
          </button>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-400 to-purple-300 mb-2 drop-shadow-lg">
            Criptograma
          </h1>
          <p className="text-gray-600 text-lg font-medium">Decifre a mensagem secreta</p>
          <p className="text-purple-500 text-sm font-semibold mt-2">
            Fase {currentPhase + 1} de {phrases.length}
          </p>
        </div>

        <GameInner onNextPhase={handleNextPhase} isLastPhase={currentPhase === phrases.length - 1} />
        <RulesModal open={showRules} onClose={() => {
          try { localStorage.setItem('seenRules', '1') } catch {}
          setShowRules(false)
        }} />
      </div>
    </GameProvider>
  );
}

