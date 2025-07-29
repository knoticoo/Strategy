import React from 'react';
import { useTranslation } from 'react-i18next';
import { PetSpecies } from '../../types';

interface PetSelectorProps {
  selectedPet: PetSpecies | null;
  onPetSelect: (pet: PetSpecies) => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({ selectedPet, onPetSelect }) => {
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
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        {t('chat.selectPet')}
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {petTypes.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onPetSelect(pet.id)}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedPet === pet.id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{pet.emoji}</span>
            <span className="text-xs font-medium text-center">
              {t(`chat.petTypes.${pet.id}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};