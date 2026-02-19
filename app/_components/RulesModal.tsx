'use client'

import React from "react";
import { Modal } from "./Modal";

interface RulesModalProps {
  open: boolean
  onClose: () => void
}

export function RulesModal({ open, onClose }: RulesModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Regras do Criptograma</h2>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Objetivo:</strong> Decifrar a frase secreta substituindo as letras corretamente.</p>
          <p><strong>Como jogar:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Algumas letras já aparecem reveladas no início.</li>
            <li>Digite uma letra por campo. Letras corretas ficam verdes e são bloqueadas.</li>
            <li>Pontuação e espaços são considerados automaticamente (não precisam ser digitados).</li>
            <li>Quando todas as posições estiverem corretas, aparecerá um modal para avançar de fase.</li>
          </ul>
          <p className="text-xs text-gray-500">Dica: ao focar no campo o conteúdo é selecionado para facilitar.</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Entendi, começar
          </button>
        </div>
      </div>
    </Modal>
  )
}

