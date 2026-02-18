'use client'

import { createContext, useEffect, useState } from "react";

interface GameContextType {
    phrase: string
    leterKeys: Record<string, { index: number | string, value: string }>
    randomLetters: Array<[number, number]>
    getRandomLetters: () => Array<[number, number]>
    letterValues: Record<string, string>
    setLetterValue: (letter: string, value: string) => void
    isPhraseComplete: () => boolean
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

    const setLetterValue = (letter: string, value: string) => {
        setLetterValues(prev => ({
            ...prev,
            [letter]: value
        }))
    }

    const isPhraseComplete = (): boolean => {
        const words = phrase.split(' ')
        for (const word of words) {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i]
                const value = letterValues[letter]
                if (!value || value !== letter) {
                    return false
                }
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

    return (
        <GameContext.Provider value={{ phrase, leterKeys, randomLetters, getRandomLetters, letterValues, setLetterValue, isPhraseComplete }}>
            {children}
        </GameContext.Provider>
    )}