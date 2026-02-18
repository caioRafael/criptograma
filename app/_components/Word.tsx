import { GameInput } from "./GameInput";

interface WordProps {
  word: string;
  letterIndexes?: number[];
}

export function Word({ word, letterIndexes = [] }: WordProps) {
  const characters = word.split("");

  return (
    <div className="flex flex-row gap-0.5 flex-nowrap">
      {characters.map((character, index) => (
        <GameInput key={index} letter={character} visible={letterIndexes.includes(index)} />
      ))}
    </div>
  );
}