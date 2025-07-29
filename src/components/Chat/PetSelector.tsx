import React from 'react';
import { useTranslation } from 'react-i18next';
import { PetSpecies } from '../../types';

interface PetSelectorProps {
  onSelect: (pet: PetSpecies) => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  const petTypes: { id: PetSpecies; emoji: string }[] = [
    { id: 'dog', emoji: '🐕' },
    { id: 'cat', emoji: '🐱' },
    { id: 'bird', emoji: '🐦' },
    { id: 'rabbit', emoji: '🐰' },
    { id: 'hamster', emoji: '🐹' },
    { id: 'guinea_pig', emoji: '🐹' },
    { id: 'fish', emoji: '🐠' },
    { id: 'reptile', emoji: '🦎' }
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {petTypes.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelect(pet.id)}
            className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 hover:scale-105 group"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{pet.emoji}</span>
            <span className="text-xs font-medium text-center text-gray-700 group-hover:text-primary-700">
              {t(`chat.petTypes.${pet.id}`)}
            </span>
          </button>
        ))}
    </div>
  );
};