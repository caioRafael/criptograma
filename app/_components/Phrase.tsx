'use client'
import { useGame } from "../hooks/useGame";
import { WhiteSpace } from "./WhiteSpace";
import { Word } from "./Word";


export function Phrase() {
    const { phrase, randomLetters } = useGame()
    const words = phrase.split(" ")

    // randomLetters = [[0, 0], [1, 1], [2, 2]]
    // cada indice é uma coordenada [palavra, letra]
    // 1- pegar coordenada da palavra
    // 2- pegar coordenada da letra
    // 3- comparar se a coordenada da palavra é igual ao indice da palavra
    // 4- se for, manda a coordenada da letra no componente Word
    // 5- se não for, manda undefined para o componente Word

    const getLetterIndexes = (wordIndex: number) => {
        const letterIndexes = randomLetters
            .filter(letter => letter[0] === wordIndex)
            .map(letter => letter[1])
        return letterIndexes
    }
    
    if (randomLetters.length === 0) {
      return <div>Loading...</div>
    }
    return(
        <div className="flex items-center justify-center gap-5 flex-wrap">
        {words.map((word, index) => (
          <div key={word + index} className="flex flex-row gap-0.5 flex-wrap">
            <Word word={word} wordIndex={index} letterIndexes={getLetterIndexes(index)} />
            {/* <WhiteSpace/> */}
          </div>
        ))}
      </div>
    )
}