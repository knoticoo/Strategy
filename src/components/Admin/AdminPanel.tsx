import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { 
  Activity, 
  Brain, 
  Database, 
  Server, 
  Cpu, 
  HardDrive, 
  Memory, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  ArrowLeft,
  LogOut
} from 'lucide-react';

interface TrainingStatus {
  isTraining: boolean;
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  bestLoss: number;
  trainingTime: string;
  estimatedTimeRemaining: string;
  datasetSize: number;
  modelSize: string;
  status: 'idle' | 'collecting_data' | 'training' | 'completed' | 'error';
  lastUpdated: string;
}

interface SystemStats {
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  gpu?: {
    usage: number;
    memory: number;
    temperature: number;
  };
}

interface ModelInfo {
  name: string;
  version: string;
  size: string;
  parameters: string;
  trainingData: number;
  accuracy: number;
  languages: string[];
  lastTrained: string;
  isActive: boolean;
}

interface AdminStats {
  totalQueries: number;
  successfulResponses: number;
  averageResponseTime: number;
  activeUsers: number;
  medicationsGenerated: number;
  translationsPerformed: number;
  uptime: string;
}

export const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'system' | 'model' | 'analytics'>('overview');
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: false,
    progress: 0,
    currentEpoch: 0,
    totalEpochs: 3,
    currentLoss: 0,
    bestLoss: 0,
    trainingTime: '00:00:00',
    estimatedTimeRemaining: 'Calculating...',
    datasetSize: 0,
    modelSize: '0 MB',
    status: 'idle',
    lastUpdated: new Date().toISOString()
  });
  
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: { usage: 0, cores: 2 },
    memory: { used: 0, total: 4096, percentage: 0 },
    disk: { used: 0, total: 50000, percentage: 0 }
  });
  
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    name: 'VeterinaryAI-DialoGPT',
    version: '1.0.0',
    size: 'Not trained',
    parameters: 'Unknown',
    trainingData: 0,
    accuracy: 0,
    languages: ['English', 'Latvian', 'Russian'],
    lastTrained: 'Never',
    isActive: false
  });
  
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalQueries: 0,
    successfulResponses: 0,
    averageResponseTime: 0,
    activeUsers: 0,
    medicationsGenerated: 0,
    translationsPerformed: 0,
    uptime: '00:00:00'
  });

  const [isLoading, setIsLoading] = useState(true);

  // Password authentication
  const handleLogin = (password: string) => {
    if (password === 'Millie1991') {
      setIsAuthenticated(true);
      setLoginError('');
      // Store authentication in sessionStorage
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data from API
  const fetchTrainingStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/admin/training-status');
      if (response.ok) {
        const data = await response.json();
        setTrainingStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch training status:', error);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/admin/system-stats');
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/admin/model-info');
      if (response.ok) {
        const data = await response.json();
        setModelInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch model info:', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  const startTraining = async () => {
    try {
      await fetch('http://localhost:3001/api/v1/admin/start-training', { method: 'POST' });
      fetchTrainingStatus();
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  const stopTraining = async () => {
    try {
      await fetch('http://localhost:3001/api/v1/admin/stop-training', { method: 'POST' });
      fetchTrainingStatus();
    } catch (error) {
      console.error('Failed to stop training:', error);
    }
  };

  const restartServices = async () => {
    try {
      await fetch('http://localhost:3001/api/v1/admin/restart-services', { method: 'POST' });
    } catch (error) {
      console.error('Failed to restart services:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setLoginError('');
  };

  // Real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchTrainingStatus(),
        fetchSystemStats(),
        fetchModelInfo(),
        fetchAdminStats()
      ]);
      setIsLoading(false);
    };

    fetchAllData();

    // Update every 5 seconds
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'collecting_data': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training': return <Brain className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'collecting_data': return <Database className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to App</span>
              </Link>
              <Server className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Pet Doctor - Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trainingStatus.status)}`}>
                {getStatusIcon(trainingStatus.status)}
                <span className="capitalize">{trainingStatus.status.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={restartServices}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restart Services</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'training', label: 'AI Training', icon: Brain },
              { id: 'system', label: 'System', icon: Server },
              { id: 'model', label: 'Model', icon: Zap },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Queries</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.totalQueries.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.activeUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.uptime}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.averageResponseTime}ms</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Training Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Training Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Training Progress</span>
                  <span className="text-sm font-medium text-gray-900">{trainingStatus.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingStatus.progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Epoch:</span>
                    <span className="ml-2 font-medium">{trainingStatus.currentEpoch}/{trainingStatus.totalEpochs}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Loss:</span>
                    <span className="ml-2 font-medium">{trainingStatus.currentLoss.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dataset Size:</span>
                    <span className="ml-2 font-medium">{trainingStatus.datasetSize.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ETA:</span>
                    <span className="ml-2 font-medium">{trainingStatus.estimatedTimeRemaining}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">CPU Usage</h4>
                  <Cpu className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{systemStats.cpu.usage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${systemStats.cpu.usage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{systemStats.cpu.cores} cores</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Memory</h4>
                  <Memory className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{systemStats.memory.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${systemStats.memory.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {(systemStats.memory.used / 1024).toFixed(1)}GB / {(systemStats.memory.total / 1024).toFixed(1)}GB
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Storage</h4>
                  <HardDrive className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{systemStats.disk.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${systemStats.disk.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {(systemStats.disk.used / 1024).toFixed(1)}GB / {(systemStats.disk.total / 1024).toFixed(1)}GB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* Training Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Training Control</h3>
                <div className="flex space-x-3">
                  {!trainingStatus.isTraining ? (
                    <button
                      onClick={startTraining}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Training</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopTraining}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Stop Training</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Training Progress */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-900">{trainingStatus.progress.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${trainingStatus.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Epoch</p>
                    <p className="text-2xl font-bold text-gray-900">{trainingStatus.currentEpoch}</p>
                    <p className="text-xs text-gray-500">of {trainingStatus.totalEpochs}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Loss</p>
                    <p className="text-2xl font-bold text-gray-900">{trainingStatus.currentLoss.toFixed(4)}</p>
                    <p className="text-xs text-gray-500">Best: {trainingStatus.bestLoss.toFixed(4)}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Training Time</p>
                    <p className="text-2xl font-bold text-gray-900">{trainingStatus.trainingTime}</p>
                    <p className="text-xs text-gray-500">ETA: {trainingStatus.estimatedTimeRemaining}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Dataset Size</p>
                    <p className="text-2xl font-bold text-gray-900">{trainingStatus.datasetSize.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">samples</p>
                  </div>
                </div>

                {/* Training Logs */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Training Logs</h4>
                  <div className="text-green-400 font-mono text-sm space-y-1 max-h-40 overflow-y-auto">
                    <div>[{new Date().toLocaleTimeString()}] Training epoch {trainingStatus.currentEpoch}/{trainingStatus.totalEpochs}</div>
                    <div>[{new Date().toLocaleTimeString()}] Loss: {trainingStatus.currentLoss.toFixed(4)}</div>
                    <div>[{new Date().toLocaleTimeString()}] Progress: {trainingStatus.progress.toFixed(1)}%</div>
                    {trainingStatus.status === 'completed' && (
                      <div className="text-green-300">[{new Date().toLocaleTimeString()}] ✅ Training completed successfully!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here... */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
            <p className="text-gray-600">System monitoring details coming soon...</p>
          </div>
        )}

        {activeTab === 'model' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Management</h3>
            <p className="text-gray-600">Model management features coming soon...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibent text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600">Analytics and insights coming soon...</p>
          </div>
        )}

          {/* Footer */}
          <footer className="mt-12 bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">AI Pet Doctor Admin Panel</span>
                </div>
                <div className="text-sm text-gray-500">
                  v1.0.0 | Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(new Date().getDate()).padStart(2, '0')}
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>System Uptime: {Math.floor((Date.now() - systemStats.startTime) / 1000 / 60)} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Status: Operational</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Training Model:</strong> {modelInfo.modelName || 'DialoGPT-Small'}
                </div>
                <div>
                  <strong>Database:</strong> SQLite + Local AI Knowledge Base
                </div>
                <div>
                  <strong>Last Update:</strong> {new Date(trainingStatus.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  };