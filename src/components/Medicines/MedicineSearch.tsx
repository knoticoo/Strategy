import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Pill, AlertTriangle, CheckCircle } from 'lucide-react';
import { Medicine, MedicineCategory, PetSpecies } from '../../types';
import { vetDatabase } from '../../services/database/vetDatabase';
import { MedicineCard } from './MedicineCard';

export const MedicineSearch: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory | 'all'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | 'all'>('all');
  const [searchResults, setSearchResults] = useState<Medicine[]>(vetDatabase.getAllMedicines());
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const categories: { id: MedicineCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('medicines.categories.all') },
    { id: 'antibiotics', label: t('medicines.categories.antibiotics') },
    { id: 'painkillers', label: t('medicines.categories.painkillers') },
    { id: 'vitamins', label: t('medicines.categories.vitamins') },
    { id: 'food', label: t('medicines.categories.food') },
    { id: 'supplements', label: t('medicines.categories.supplements') }
  ];

  const species: { id: PetSpecies | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'Visi', emoji: '🐾' },
    { id: 'dog', label: t('chat.petTypes.dog'), emoji: '🐕' },
    { id: 'cat', label: t('chat.petTypes.cat'), emoji: '🐱' },
    { id: 'bird', label: t('chat.petTypes.bird'), emoji: '🐦' },
    { id: 'rabbit', label: t('chat.petTypes.rabbit'), emoji: '🐰' },
    { id: 'hamster', label: t('chat.petTypes.hamster'), emoji: '🐹' },
    { id: 'guinea_pig', label: t('chat.petTypes.guinea_pig'), emoji: '🐹' },
    { id: 'fish', label: t('chat.petTypes.fish'), emoji: '🐠' },
    { id: 'reptile', label: t('chat.petTypes.reptile'), emoji: '🦎' }
  ];

  useEffect(() => {
    const filters = {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      species: selectedSpecies === 'all' ? undefined : selectedSpecies
    };
    
    const results = vetDatabase.searchMedicinesAdvanced(searchQuery, filters);
    setSearchResults(results);
    
    // Reset selected medicine if it's not in the new results
    if (selectedMedicine && !results.find(m => m.id === selectedMedicine.id)) {
      setSelectedMedicine(null);
    }
  }, [searchQuery, selectedCategory, selectedSpecies, selectedMedicine]);

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
  };

  const getCategoryColor = (category: MedicineCategory): string => {
    const colors = {
      antibiotics: 'bg-red-100 text-red-800',
      painkillers: 'bg-orange-100 text-orange-800',
      vitamins: 'bg-green-100 text-green-800',
      food: 'bg-blue-100 text-blue-800',
      supplements: 'bg-purple-100 text-purple-800',
      antiparasitic: 'bg-yellow-100 text-yellow-800',
      digestive: 'bg-indigo-100 text-indigo-800',
      skin_care: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <Pill className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('medicines.title')}</h2>
            <p className="text-gray-600">Meklējiet medikamentus un barību pēc nosaukuma vai sastāvdaļām</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('medicines.search')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Kategorija
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MedicineCategory | 'all')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Species Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dzīvnieka veids
            </label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value as PetSpecies | 'all')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {species.map(spec => (
                <option key={spec.id} value={spec.id}>
                  {spec.emoji} {spec.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Search Results */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Rezultāti ({searchResults.length})
            </h3>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nav atrasti rezultāti</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  onClick={() => handleMedicineSelect(medicine)}
                  className={`card cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedMedicine?.id === medicine.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {medicine.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                          {t(`medicines.categories.${medicine.category}`)}
                        </span>
                        {medicine.prescriptionRequired && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Recepte
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{medicine.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Piemērots: {medicine.forSpecies.map(s => t(`chat.petTypes.${s}`)).join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {medicine.prescriptionRequired ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine Details */}
        <div className="lg:col-span-1">
          {selectedMedicine ? (
            <MedicineCard medicine={selectedMedicine} />
          ) : (
            <div className="card text-center">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Izvēlieties medikamentu, lai skatītu detalizētu informāciju</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};