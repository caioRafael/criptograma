'use client'

import { createContext, useEffect, useState } from "react";

interface GameContextType {
    phrase: string
    leterKeys: Record<string, { index: number | string, value: string }>
    randomLetters: Array<[number, number]>
    getRandomLetters: () => Array<[number, number]>
    helpRemaining: number
    revealRandomLetter: () => boolean
    letterValues: Record<string, string>
    setLetterValue: (letter: string, value: string) => void
    letterStatuses: Record<string, 'correct' | 'incorrect' | 'default'>
    setLetterStatus: (letter: string, status: 'correct' | 'incorrect' | 'default') => void
    areAllInputsCorrect: () => boolean
    isPhraseComplete: () => boolean
    getTypedPhrase: () => string
    isTypedPhraseEqual: () => boolean
}

interface GameProviderProps {
    children: React.ReactNode
    phrase: string
}
export const GameContext = createContext({} as GameContextType)

export function GameProvider({ children, phrase }: GameProviderProps) {
    const [leterKeys, setLetterKeys] = useState<Record<string, { index: number | string, value: string }>>({})
    const [randomLetters, setRandomLetters] = useState<Array<[number, number]>>([])
    const [letterValues, setLetterValues] = useState<Record<string, string>>({})
    const [letterStatuses, setLetterStatuses] = useState<Record<string, 'correct' | 'incorrect' | 'default'>>({})
    const [helpRemaining, setHelpRemaining] = useState<number>(2)

    const setLetterValue = (letter: string, value: string) => {
        setLetterValues(prev => ({
            ...prev,
            [letter]: value
        }))
    }
    
    const setLetterStatus = (letter: string, status: 'correct' | 'incorrect' | 'default') => {
        setLetterStatuses(prev => {
            // Evita atualizar o estado se o status não mudou (prevenção de loop de render)
            if (prev[letter] === status) return prev
            return {
                ...prev,
                [letter]: status
            }
        })
    }

    const isPhraseComplete = (): boolean => {
        const words = phrase.split(' ')
        for (const word of words) {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i]
                // considera caracteres que não sejam letras/números Unicode (pontuação/espaços) como já corretos
                if (!/[\p{L}\p{N}]/u.test(letter)) {
                    continue
                }
                const value = letterValues[letter]
                if (!value || value !== letter) {
                    return false
                }
            }
        }
        return true
    }

    const getTypedPhrase = (): string => {
        // Constrói a frase atual com base nos valores digitados para cada caractere da frase original.
        // Mantém o mesmo tamanho da frase usando um placeholder para posições não preenchidas,
        // isso permite comparar por posição exata posteriormente.
        const PLACEHOLDER = '\u0000'
        return phrase
            .split('')
            .map((ch) => {
            if (!/[\p{L}\p{N}]/u.test(ch)) return ch
                const v = letterValues[ch]
                return v ? v : PLACEHOLDER
            })
            .join('')
    }

    const isTypedPhraseEqual = (): boolean => {
        const typed = getTypedPhrase()
        // logs para debug
        console.log("[isTypedPhraseEqual] phrase:", JSON.stringify(phrase))
        console.log("[isTypedPhraseEqual] typed :", JSON.stringify(typed))
        console.log("[isTypedPhraseEqual] letterValues:", letterValues)

        if (typed.length !== phrase.length) {
            console.log("[isTypedPhraseEqual] length mismatch", typed.length, phrase.length)
            return false
        }

        const PLACEHOLDER = '\u0000'

        for (let i = 0; i < phrase.length; i++) {
            const original = phrase[i]
            const typedChar = typed[i]
            if (!/[\p{L}\p{N}]/u.test(original)) {
                if (typedChar !== original) {
                    console.log("[isTypedPhraseEqual] non-alnum mismatch at", i, original, typedChar)
                    return false
                }
                continue
            }
            if (typedChar === PLACEHOLDER) {
                console.log("[isTypedPhraseEqual] placeholder at", i)
                return false
            }
            if (typedChar !== original) {
                console.log("[isTypedPhraseEqual] char mismatch at", i, original, typedChar)
                return false
            }
        }
        console.log("[isTypedPhraseEqual] exact match -> true")
        return true
    }

    const areAllInputsCorrect = (): boolean => {
        // Verifica o status das posições informado pelos componentes GameInput.
        // Considera caracteres que não sejam letras/números Unicode (pontuação/espaços) como já corretos.
        const words = phrase.split(' ')
        for (let w = 0; w < words.length; w++) {
            const word = words[w]
            for (let i = 0; i < word.length; i++) {
                const ch = word[i]
                if (!/[\p{L}\p{N}]/u.test(ch)) continue
                const key = `${w}-${i}`
                const status = letterStatuses[key]
                if (status !== 'correct') return false
            }
        }
        return true
    }

    const getRandomLetters = (): Array<[number, number]> => {
        const words = phrase.split(' ')
        
        // Coleta todas as letras únicas da frase (sem espaços)
        const uniqueLetters = Array.from(
            new Set(phrase.replace(/\s+/g, '').split(''))
        ).filter(char => char.trim() !== '')
        
        // Seleciona 3 letras únicas aleatórias
        const shuffledUnique = [...uniqueLetters].sort(() => Math.random() - 0.5)
        const selectedUniqueLetters = shuffledUnique.slice(0, Math.min(3, uniqueLetters.length))
        
        // Para cada letra selecionada, encontra todas as suas posições na frase
        const revealedPositions: Array<[number, number]> = []
        
        selectedUniqueLetters.forEach(letter => {
            // Encontra todas as posições onde essa letra aparece
            const positions: Array<[number, number]> = []
            
            words.forEach((word, wordIndex) => {
                word.split('').forEach((char, letterIndex) => {
                    if (char === letter) {
                        positions.push([wordIndex, letterIndex])
                    }
                })
            })
            
            // Seleciona aleatoriamente apenas UMA posição dessa letra
            if (positions.length > 0) {
                const randomPosition = positions[Math.floor(Math.random() * positions.length)]
                revealedPositions.push(randomPosition)
            }
        })
        
        // Retorna no formato [[posição da palavra, posição da letra na palavra], ...]
        return revealedPositions
    }

    useEffect(() => {
    const uniqueLetters = Array.from(
        new Set(phrase.replace(/\s+/g, '').split(''))
    );
    
    // Separa letras/números de caracteres especiais
    const lettersAndNumbers = uniqueLetters.filter(char => /[A-Za-z0-9]/.test(char));
    
    // Gera um array de índices de 0 a lettersAndNumbers.length - 1 e embaralha
    const shuffledIndices = Array.from({ length: lettersAndNumbers.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5);
    
    const uniqueLettersObject = uniqueLetters.reduce((acc, letter) => {
        // Verifica se é caractere especial
        if (!/[A-Za-z0-9]/.test(letter)) {
            acc[letter] = {
                index: '*',
                value: letter,
            };
        } else {
            // Encontra o índice da letra no array de letras/números
            const letterIndex = lettersAndNumbers.indexOf(letter);
            acc[letter] = {
                index: shuffledIndices[letterIndex],
                value: letter,
            };
        }
        return acc;
    }, {} as Record<string, { index: number | string, value: string }>);
    
    console.log(uniqueLettersObject);
    setLetterKeys(uniqueLettersObject);
    }, [phrase])

    // Executa o sorteio assim que a tela carregar
    useEffect(() => {
        // Limpa os valores anteriores
        setLetterValues({})
        
        const randomLettersArray = getRandomLetters();
        console.log('Random letters selected: ', randomLettersArray)
        setRandomLetters(randomLettersArray);
        
        // NÃO inicializa letterValues aqui
        // As letras reveladas serão mostradas apenas através do prop 'visible' no GameInput
        // Quando o usuário acertar uma letra, aí sim preencheremos todas as ocorrências via setLetterValue
        console.log('Revealed positions:', randomLettersArray)
        setLetterValues({})
    }, [phrase])

    // reseta o contador de ajudas a cada mudança de frase
    useEffect(() => {
        setHelpRemaining(2)
    }, [phrase])

    const revealRandomLetter = (): boolean => {
        // seleciona letras alfanuméricas que ainda não foram reveladas/escritas corretamente
        try {
            const uniqueLetters = Array.from(new Set(phrase.replace(/\s+/g, '').split('')))
                .filter(ch => /[\p{L}\p{N}]/u.test(ch))

            // letras já reveladas pelo sorteio inicial (randomLetters) — essas não devem ser escolhidas
            const words = phrase.split(' ')
            const revealedByRandom = new Set(
                randomLetters
                    .map(([w, l]) => words[w]?.[l])
                    .filter(Boolean)
            )

            const unrevealed = uniqueLetters.filter(ch => letterValues[ch] !== ch && !revealedByRandom.has(ch))
            if (unrevealed.length === 0) return false
            if (helpRemaining <= 0) return false
            const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)]
            // preenche todas as ocorrências desta letra
            setLetterValues(prev => ({ ...prev, [pick]: pick }))
            setHelpRemaining(h => Math.max(0, h - 1))
            return true
        } catch (e) {
            return false
        }
    }

    return (
        <GameContext.Provider value={{
            phrase,
            leterKeys,
            randomLetters,
            getRandomLetters,
            letterValues,
            setLetterValue,
            helpRemaining,
            revealRandomLetter,
            letterStatuses,
            setLetterStatus,
            areAllInputsCorrect,
            isPhraseComplete,
            getTypedPhrase,
            isTypedPhraseEqual
        }}>
            {children}
        </GameContext.Provider>
    )}