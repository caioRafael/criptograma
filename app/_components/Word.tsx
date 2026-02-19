import { GameInput } from "./GameInput";

interface WordProps {
  word: string;
  wordIndex: number;
  letterIndexes?: number[];
}

export function Word({ word, wordIndex, letterIndexes = [] }: WordProps) {
  const characters = word.split("");

  return (
    <div className="flex flex-row gap-0.5 flex-wrap">
      {characters.map((character, index) => (
        <GameInput
          key={index}
          letter={character}
          visible={letterIndexes.includes(index)}
          wordIndex={wordIndex}
          letterIndex={index}
        />
      ))}
    </div>
  );
}