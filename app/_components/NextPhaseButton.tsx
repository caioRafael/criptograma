'use client'

interface NextPhaseButtonProps {
    onNextPhase: () => void
    isLastPhase?: boolean
}

export function NextPhaseButton({ onNextPhase, isLastPhase = false }: NextPhaseButtonProps) {
    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-green-600 font-bold text-xl animate-bounce">
                ✓ Parabéns! Fase completada!
            </div>
            {!isLastPhase ? (
                <button
                    onClick={onNextPhase}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold text-lg rounded-xl shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                    Próxima Fase →
                </button>
            ) : (
                <div className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-400 text-white font-bold text-lg rounded-xl shadow-lg">
                    🎉 Todas as fases completadas!
                </div>
            )}
        </div>
    )
}
