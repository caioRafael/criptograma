'use client'

import { useEffect, useState } from "react"
import { useGame } from "../hooks/useGame"

export function GameInput({ letter, visible, wordIndex, letterIndex }: { letter: string, visible: boolean, wordIndex: number, letterIndex: number }) {
    const { leterKeys, letterValues, setLetterValue, setLetterStatus, letterStatuses } = useGame()
    // Se está visível (revelada no início), mostra a letra
    // Se não está visível mas foi preenchida pelo usuário, mostra o valor preenchido
    const value = visible ? letter : (letterValues[letter] || '')
    const [inputStatus, setInputStatus] = useState<'correct' | 'incorrect' | 'default'>('default')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // detecta mobile no cliente para tratar comportamento do teclado virtual
        try {
            const ua = navigator.userAgent || ''
            setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Phone/i.test(ua) || ('ontouchstart' in window))
        } catch (e) {
            setIsMobile(false)
        }
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

    useEffect(() => {
        // notifica o contexto sobre o status desta posição apenas se diferente do atual
        if (!setLetterStatus) return
        const posKey = `${wordIndex}-${letterIndex}`
        const current = letterStatuses?.[posKey]
        if (current === inputStatus) return
        setLetterStatus(posKey, inputStatus)
    }, [inputStatus, letter, setLetterStatus, letterStatuses, wordIndex, letterIndex])

    return (
      <div className="flex flex-col items-center justify-center gap-1.5">
        <input 
            type="text" 
            maxLength={1}
            inputMode="text"
            autoComplete="off"
            enterKeyHint="done"
            className={`
                w-10 h-10 sm:w-12 sm:h-12
                text-center
                text-lg sm:text-xl font-bold
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
                // Se uma letra foi digitada (inclui letras Unicode), substitui diretamente o valor
                if (e.key.length === 1 && /\p{L}/u.test(e.key)) {
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
            // Não desabilita no mobile ao marcar como 'correct' para evitar que o teclado virtual feche.
            disabled={visible || (inputStatus === 'correct' && !isMobile)}
            placeholder=""
        />
        <span className="text-xs font-semibold text-gray-600 min-h-[16px] flex items-center justify-center">
            {leterKeys[letter]?.index ?? ''}
        </span>
      </div>
    )
}