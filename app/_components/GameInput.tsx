'use client'

import { useEffect, useState } from "react"
import { useGame } from "../hooks/useGame"

export function GameInput({ letter, visible }: { letter: string, visible: boolean }) {
    const { leterKeys, letterValues, setLetterValue } = useGame()
    // Se está visível (revelada no início), mostra a letra
    // Se não está visível mas foi preenchida pelo usuário, mostra o valor preenchido
    const value = visible ? letter : (letterValues[letter] || '')
    const [inputStatus, setInputStatus] = useState<'correct' | 'incorrect' | 'default'>('default')

    useEffect(() => {
        if (visible) {
            setInputStatus('correct')
        } else if (!value || value === '') {
            setInputStatus('default')
        } else if (value === letter) {
            setInputStatus('correct')
        } else {
            setInputStatus('incorrect')
        }
    }, [value, letter, visible])

    return (
      <div className="flex flex-col items-center justify-center gap-1.5">
        <input 
            type="text" 
            maxLength={1}
            className={`
                w-12 h-12 
                text-center 
                text-xl font-bold
                rounded-lg
                border-2
                transition-all duration-200
                outline-none
                focus:scale-105
                disabled:cursor-not-allowed
                ${
                    inputStatus === 'correct' 
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-500/20' 
                        : inputStatus === 'incorrect' 
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-500/20 animate-pulse' 
                        : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:border-blue-500 focus:bg-blue-50 shadow-sm'
                }
            `}
            value={value}
            onKeyDown={(e) => {
                // Se uma letra foi digitada, substitui diretamente o valor
                if (e.key.length === 1 && /[A-Za-z]/.test(e.key)) {
                    e.preventDefault()
                    setLetterValue(letter, e.key.toUpperCase())
                }
                // Permite Backspace e Delete para apagar
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    setLetterValue(letter, '')
                }
            }}
            onChange={(e) => {
                // Fallback para outros métodos de entrada (colar, etc)
                const newValue = e.target.value.toUpperCase().slice(-1)
                setLetterValue(letter, newValue)
            }}
            onFocus={(e) => {
                // Seleciona o texto quando o campo recebe foco para facilitar substituição
                e.target.select()
            }}
            disabled={inputStatus === 'correct' || visible}
            placeholder=""
        />
        <span className="text-xs font-semibold text-gray-600 min-h-[16px] flex items-center justify-center">
            {leterKeys[letter]?.index ?? ''}
        </span>
      </div>
    )
}