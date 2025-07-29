import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Edit,
  Trash2,
  X,
  BookOpen
} from 'lucide-react';
import { EducationalContent, ContentForm } from '../../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS, STATUS_COLORS } from '../../constants';

export const EducationAdmin: React.FC = () => {
  const { t } = useTranslation();
  
  // Education Admin State
  const [educationContent, setEducationContent] = useState<EducationalContent[]>([
    {
      id: 'nature-1',
      title: 'Wildlife Watching: Birds and Mammals of Latvia',
      category: 'nature',
      type: 'quiz',
      difficulty: 'beginner',
      duration: 25,
      description: 'Learn to identify common birds and mammals in Latvian forests and parks.',
      content: '',
      images: [],
      relatedTrails: [],
      tags: [],
      rating: 4.7,
      completedBy: 1247,
      createdAt: '2024-01-15',
      author: {
        name: 'Nature Expert',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        expertise: 'Wildlife Biologist'
      },
      questions: [
        {
          question: "Which tree is most common in Latvian forests?",
          options: ["Oak", "Pine", "Birch", "Maple"],
          correct: 1
        },
        {
          question: "What is the best time for wildlife observation?",
          options: ["Midday", "Early morning", "Late afternoon", "Both B and C"],
          correct: 3
        }
      ],
      status: 'published'
    },
    {
      id: 'photography-1',
      title: 'Golden Hour Photography in Baltic Forests',
      category: 'photography',
      type: 'quiz',
      difficulty: 'intermediate',
      duration: 35,
      description: 'Master the art of capturing stunning forest photography during golden hour.',
      content: '',
      images: [],
      relatedTrails: [],
      tags: [],
      rating: 4.9,
      completedBy: 2341,
      createdAt: '2024-01-20',
      author: {
        name: 'Photo Pro',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        expertise: 'Professional Photographer'
      },
      questions: [
        {
          question: "What is the 'golden hour' in photography?",
          options: ["Noon time", "Hour after sunrise/before sunset", "Midnight", "Any sunny hour"],
          correct: 1
        },
        {
          question: "Which camera setting is most important for forest photography?",
          options: ["ISO", "Aperture", "Shutter Speed", "All of the above"],
          correct: 3
        }
      ],
      status: 'published'
    }
  ]);

  const [editingContent, setEditingContent] = useState<EducationalContent | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [contentForm, setContentForm] = useState<ContentForm>({
    title: '',
    category: 'nature',
    type: 'quiz',
    difficulty: 'beginner',
    duration: 15,
    description: '',
    questions: [
      { question: '', options: ['', '', '', ''], correct: 0 }
    ]
  });

  // Initialize form when editing
  useEffect(() => {
    if (editingContent) {
      setContentForm({
        title: editingContent.title || '',
        category: editingContent.category || 'nature',
        type: editingContent.type || 'quiz',
        difficulty: editingContent.difficulty || 'beginner',
        duration: editingContent.duration || 15,
        description: editingContent.description || '',
        questions: editingContent.questions || [
          { question: '', options: ['', '', '', ''], correct: 0 }
        ]
      });
    } else {
      setContentForm({
        title: '',
        category: 'nature',
        type: 'quiz',
        difficulty: 'beginner',
        duration: 15,
        description: '',
        questions: [
          { question: '', options: ['', '', '', ''], correct: 0 }
        ]
      });
    }
  }, [editingContent]);

  const handleSaveContent = () => {
    const newContent: EducationalContent = {
      id: editingContent?.id || `content-${Date.now()}`,
      title: contentForm.title,
      category: contentForm.category as any,
      type: contentForm.type as any,
      difficulty: contentForm.difficulty as any,
      duration: contentForm.duration,
      description: contentForm.description,
      content: contentForm.description,
      images: [],
      relatedTrails: [],
      tags: [],
      rating: editingContent?.rating || 0,
      completedBy: editingContent?.completedBy || 0,
      createdAt: editingContent?.createdAt || new Date().toISOString(),
      author: editingContent?.author || {
        name: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        expertise: 'Administrator'
      },
      questions: contentForm.questions,
      status: editingContent?.status || 'draft'
    };

    if (editingContent) {
      setEducationContent(prev => prev.map(c => c.id === editingContent.id ? newContent : c));
    } else {
      setEducationContent(prev => [...prev, newContent]);
    }

    setShowContentEditor(false);
    setEditingContent(null);
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setEducationContent(prev => prev.filter(c => c.id !== contentId));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Educational Content Management
        </h3>
        <button
          onClick={() => {
            setEditingContent(null);
            setShowContentEditor(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Content
        </button>
      </div>

      {/* Content Editor Modal */}
      {showContentEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingContent ? 'Edit Content' : 'Add New Content'}
                </h4>
                <button
                  onClick={() => setShowContentEditor(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={contentForm.title}
                      onChange={(e) => setContentForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter content title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={contentForm.category}
                      onChange={(e) => setContentForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="nature">Nature</option>
                      <option value="history">History</option>
                      <option value="culture">Culture</option>
                      <option value="photography">Photography</option>
                      <option value="survival">Survival</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={contentForm.difficulty}
                      onChange={(e) => setContentForm(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={contentForm.duration}
                      onChange={(e) => setContentForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="5"
                      max="120"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) => setContentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter content description..."
                  />
                </div>

                {/* Quiz Questions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quiz Questions ({contentForm.questions.length})
                    </label>
                    <button
                      onClick={() => setContentForm(prev => ({
                        ...prev,
                        questions: [...prev.questions, { question: '', options: ['', '', '', ''], correct: 0 }]
                      }))}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {contentForm.questions.map((q, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            Question {qIndex + 1}
                          </h5>
                          {contentForm.questions.length > 1 && (
                            <button
                              onClick={() => setContentForm(prev => ({
                                ...prev,
                                questions: prev.questions.filter((_, i) => i !== qIndex)
                              }))}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const newQuestions = [...contentForm.questions];
                              newQuestions[qIndex].question = e.target.value;
                              setContentForm(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter question..."
                          />

                          {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correct === oIndex}
                                onChange={() => {
                                  const newQuestions = [...contentForm.questions];
                                  newQuestions[qIndex].correct = oIndex;
                                  setContentForm(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="text-green-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...contentForm.questions];
                                  newQuestions[qIndex].options[oIndex] = e.target.value;
                                  setContentForm(prev => ({ ...prev, questions: newQuestions }));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder={`Option ${oIndex + 1}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setShowContentEditor(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingContent ? 'Update Content' : 'Create Content'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { id: 'nature', name: 'Nature Education', count: 12, color: 'bg-green-100 text-green-800' },
          { id: 'history', name: 'Historical Sites', count: 8, color: 'bg-amber-100 text-amber-800' },
          { id: 'culture', name: 'Cultural Heritage', count: 6, color: 'bg-purple-100 text-purple-800' },
          { id: 'photography', name: 'Photography', count: 15, color: 'bg-blue-100 text-blue-800' },
          { id: 'survival', name: 'Survival Skills', count: 10, color: 'bg-red-100 text-red-800' }
        ].map(category => (
          <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                {category.count} items
              </span>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Manage
              </button>
              <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Add New
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Content List */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Educational Content ({educationContent.length} items)
        </h4>
        <div className="space-y-3">
          {educationContent.map((content) => (
            <div key={content.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                  {content.title}
                </h5>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {CATEGORY_LABELS[content.category as keyof typeof CATEGORY_LABELS]} • {content.type.toUpperCase()} • {content.completedBy} completed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {content.questions?.length || 0} questions • {content.duration} min • {content.difficulty}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  STATUS_COLORS[content.status as keyof typeof STATUS_COLORS]
                }`}>
                  {STATUS_LABELS[content.status as keyof typeof STATUS_LABELS]}
                </span>
                <button 
                  onClick={() => {
                    setEditingContent(content);
                    setShowContentEditor(true);
                  }}
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="Edit Content"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteContent(content.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Delete Content"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Content</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{educationContent.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Published</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {educationContent.filter(c => c.status === 'published').length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Draft</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {educationContent.filter(c => c.status === 'draft').length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Views</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
            {educationContent.reduce((sum, c) => sum + c.completedBy, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};