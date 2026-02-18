'use client'

import { useState, useEffect } from "react";
import { Phrase } from "./_components/Phrase";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { NextPhaseButton } from "./_components/NextPhaseButton";

const PHRASES = [
  "O CARRO VERMELHO FEZ UM GIRO!",
  "BADA BADA BUM",
]

function GameContent({ onNextPhase, isLastPhase }: { onNextPhase: () => void, isLastPhase: boolean }) {
  const { isPhraseComplete, letterValues, phrase } = useGame()
  const [showNextButton, setShowNextButton] = useState(false)

  useEffect(() => {
    // Verifica se a frase está completa sempre que os valores mudarem
    const checkComplete = () => {
      const words = phrase.split(' ')
      let allComplete = true
      
      for (const word of words) {
        for (let i = 0; i < word.length; i++) {
          const letter = word[i]
          const value = letterValues[letter]
          if (!value || value !== letter) {
            allComplete = false
            break
          }
        }
        if (!allComplete) break
      }
      
      setShowNextButton(allComplete)
    }
    
    checkComplete()
  }, [letterValues, phrase])

  return (
    <>
      <Phrase />
      {showNextButton && <NextPhaseButton onNextPhase={onNextPhase} isLastPhase={isLastPhase} />}
    </>
  )
}

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phrase, setPhrase] = useState(PHRASES[currentPhase])

  const handleNextPhase = () => {
    if (currentPhase < PHRASES.length - 1) {
      const nextPhase = currentPhase + 1
      setCurrentPhase(nextPhase)
      setPhrase(PHRASES[nextPhase])
    }
  }

  return (
    <GameProvider phrase={phrase} key={currentPhase}>
      <div className="flex flex-col gap-6 min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white py-8">
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-400 to-purple-300 mb-2 drop-shadow-lg">
            Criptograma
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Decifre a mensagem secreta
          </p>
          <p className="text-purple-500 text-sm font-semibold mt-2">
            Fase {currentPhase + 1} de {PHRASES.length}
          </p>
        </div>
        <GameContent onNextPhase={handleNextPhase} isLastPhase={currentPhase === PHRASES.length - 1} />
      </div>
    </GameProvider>
  );
}
