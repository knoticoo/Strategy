// Enhanced JavaScript for AI Art Analyzer

document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeEnhancedApp();
    } catch (error) {
        console.error('Enhanced app initialization failed:', error);
        // Attempt basic initialization
        initializeBasicEnhancedApp();
    }
});

function initializeEnhancedApp() {
    bindEnhancedFormEvents();
    loadAnalysisHistory();
    checkApiStatus();
    console.log('Enhanced app initialized successfully');
}

function initializeBasicEnhancedApp() {
    try {
        bindBasicEnhancedFormEvents();
        console.log('Basic enhanced app initialized');
    } catch (error) {
        console.error('Basic enhanced app initialization failed:', error);
    }
}

function bindBasicEnhancedFormEvents() {
    // Essential enhanced form bindings only
    safeBindForm('enhancedAnalyzeForm', handleEnhancedAnalyzeSubmit);
    safeBindForm('compareForm', handleCompareSubmit);
}

function safeBindForm(formId, handler) {
    try {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', handler);
        }
    } catch (error) {
        console.warn(`Failed to bind enhanced form ${formId}:`, error);
    }
}

function bindEnhancedFormEvents() {
    try {
        // Enhanced analysis form
        safeBindForm('enhancedAnalyzeForm', handleEnhancedAnalyzeSubmit);
        
        // Comparison form  
        safeBindForm('compareForm', handleCompareSubmit);
        
        // History refresh button
        const refreshHistory = document.getElementById('refreshHistory');
        if (refreshHistory) {
            refreshHistory.addEventListener('click', function() {
                try {
                    loadAnalysisHistory();
                } catch (error) {
                    console.error('History refresh failed:', error);
                }
            });
        }
        
        // Save analysis button (will be bound dynamically)
        document.addEventListener('click', function(e) {
            try {
                if (e.target.id === 'saveAnalysis') {
                    saveCurrentAnalysis();
                }
            } catch (error) {
                console.error('Save analysis click failed:', error);
            }
        });
        
    } catch (error) {
        console.error('Enhanced form event binding failed:', error);
        bindBasicEnhancedFormEvents();
    }
}

function handleEnhancedAnalyzeSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const file = formData.get('artwork');
        
        if (!file || file.size === 0) {
            showError('Please select an image file to analyze.');
            return;
        }
        
        if (!isValidImageFile(file)) {
            showError('Please upload a valid image file (JPG, PNG, GIF, BMP, WebP).');
            return;
        }
        
        if (file.size > 16 * 1024 * 1024) {
            showError('File size must be less than 16MB.');
            return;
        }
        
        // Show loading state
        showLoading('enhancedAnalyze');
        hideResults('enhancedAnalysis');
        
        // Make API call with enhanced error handling
        fetch('/analyze', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading('enhancedAnalyze');
            
            if (data.error) {
                showError(data.error);
            } else {
                showEnhancedAnalysisResults(data);
            }
        })
        .catch(error => {
            hideLoading('enhancedAnalyze');
            const errorMessage = error.message.includes('HTTP error') 
                ? 'Server error occurred. Please try again later.'
                : 'An error occurred while analyzing the image. Please try again.';
            showError(errorMessage);
            console.error('Enhanced analysis error:', error);
        });
        
    } catch (error) {
        hideLoading('enhancedAnalyze');
        showError('An unexpected error occurred. Please try again.');
        console.error('Enhanced analyze submit error:', error);
    }
}

function handleCompareSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const files = formData.getAll('artworks');
    
    if (files.length !== 2) {
        showError('Please select exactly 2 images for comparison.');
        return;
    }
    
    for (let i = 0; i < files.length; i++) {
        if (!files[i] || files[i].size === 0) {
            showError(`Please select image ${i + 1}.`);
            return;
        }
        
        if (!isValidImageFile(files[i])) {
            showError(`Invalid file type for image ${i + 1}. Please upload a valid image.`);
            return;
        }
        
        if (files[i].size > 16 * 1024 * 1024) {
            showError(`Image ${i + 1} is too large. Please use files smaller than 16MB.`);
            return;
        }
    }
    
    // Show loading state
    showLoading('compare');
    hideResults('compare');
    
    // Make API call
    fetch('/compare', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading('compare');
        
        if (data.error) {
            showError(data.error);
        } else {
            showComparisonResults(data);
        }
    })
    .catch(error => {
        hideLoading('compare');
        showError('An error occurred while comparing images. Please try again.');
        console.error('Comparison error:', error);
    });
}

function showEnhancedAnalysisResults(data) {
    const resultsDiv = document.getElementById('enhancedAnalysisResults');
    const imageElement = document.getElementById('enhancedAnalyzedImage');
    const textElement = document.getElementById('enhancedAnalysisText');
    
    if (resultsDiv && imageElement && textElement) {
        // Set image
        imageElement.src = 'data:image/jpeg;base64,' + data.image_data;
        
        // Format and set analysis text
        textElement.innerHTML = formatAnalysisText(data.analysis);
        
        // Store data for saving
        resultsDiv.dataset.analysisData = JSON.stringify(data);
        
        // Show results with animation
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('fade-in');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showComparisonResults(data) {
    const resultsDiv = document.getElementById('compareResults');
    const imagesDiv = document.getElementById('comparisonImages');
    const insightsDiv = document.getElementById('comparisonInsights');
    
    if (resultsDiv && imagesDiv && insightsDiv) {
        // Clear previous results
        imagesDiv.innerHTML = '';
        
        // Add comparison images
        data.comparison.forEach((artwork, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-3';
            
            col.innerHTML = `
                <div class="card">
                    <img src="data:image/jpeg;base64,${artwork.image_data}" 
                         class="card-img-top" alt="${artwork.filename}">
                    <div class="card-body">
                        <h6 class="card-title">${artwork.filename}</h6>
                        <small class="text-muted">
                            Size: ${artwork.size[0]} × ${artwork.size[1]}<br>
                            Composition: ${artwork.composition}<br>
                            Colors: ${artwork.color_harmony}
                        </small>
                    </div>
                </div>
            `;
            
            imagesDiv.appendChild(col);
        });
        
        // Set insights
        insightsDiv.innerHTML = formatAnalysisText(data.insights);
        
        // Show results with animation
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('fade-in');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function loadAnalysisHistory() {
    fetch('/history')
    .then(response => response.json())
    .then(data => {
        displayHistoryResults(data);
    })
    .catch(error => {
        console.error('Error loading history:', error);
        const historyDiv = document.getElementById('historyResults');
        if (historyDiv) {
            historyDiv.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>Error loading analysis history.</p>
                </div>
            `;
        }
    });
}

function displayHistoryResults(data) {
    const historyDiv = document.getElementById('historyResults');
    
    if (!historyDiv) return;
    
    if (!data.history || data.history.length === 0) {
        historyDiv.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-clock fa-2x mb-2"></i>
                <p>No analysis history yet. Start by analyzing an artwork!</p>
            </div>
        `;
        return;
    }
    
    // Create history timeline
    let historyHTML = `
        <div class="timeline">
            <p class="text-muted mb-3">Total analyses: ${data.total}</p>
    `;
    
    data.history.forEach((item, index) => {
        const date = new Date(item.created_at).toLocaleDateString();
        const time = new Date(item.created_at).toLocaleTimeString();
        
        historyHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="card-title">
                                <i class="fas fa-image me-2"></i>
                                ${item.filename}
                            </h6>
                            <p class="card-text">
                                <small class="text-muted">
                                    ${date} at ${time} • ${item.analysis_type} analysis
                                </small>
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button class="btn btn-outline-primary btn-sm" 
                                    onclick="viewHistoryItem('${item.filename}')">
                                <i class="fas fa-eye me-1"></i>
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    historyDiv.innerHTML = historyHTML;
}

function saveCurrentAnalysis() {
    const resultsDiv = document.getElementById('enhancedAnalysisResults');
    const analysisData = resultsDiv ? resultsDiv.dataset.analysisData : null;
    
    if (analysisData) {
        try {
            const data = JSON.parse(analysisData);
            
            // Analysis is automatically saved to database in the backend
            // Just show confirmation
            showToast('Analysis saved to history!', 'success');
            
            // Refresh history to show the new item
            setTimeout(loadAnalysisHistory, 1000);
            
        } catch (error) {
            showError('Error saving analysis.');
        }
    } else {
        showError('No analysis to save.');
    }
}

function viewHistoryItem(filename) {
    showToast(`Viewing analysis for ${filename}`, 'info');
    // In a full implementation, this would load the specific analysis
    // For now, just show a message
}

function formatAnalysisText(text) {
    // Enhanced formatting for markdown-style text
    let formatted = text
        .replace(/^# (.*$)/gm, '<h3 class="text-primary mt-4 mb-3">$1</h3>')
        .replace(/^## (.*$)/gm, '<h4 class="text-secondary mt-3 mb-2">$1</h4>')
        .replace(/^### (.*$)/gm, '<h5 class="text-dark mt-2 mb-2">$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    
    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li>.*?<\/li>(\s*<br>)*)+/g, function(match) {
        return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
    });
    
    return formatted;
}

function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    return validTypes.includes(file.type);
}

function showLoading(type) {
    const loadingElement = document.getElementById(`${type}Loading`);
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    // Disable form
    const form = document.getElementById(`${type}Form`);
    if (form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        }
    }
}

function hideLoading(type) {
    const loadingElement = document.getElementById(`${type}Loading`);
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Re-enable form
    const form = document.getElementById(`${type}Form`);
    if (form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            if (type === 'enhancedAnalyze') {
                button.innerHTML = '<i class="fas fa-chart-line me-2"></i>Advanced Analysis';
            } else if (type === 'compare') {
                button.innerHTML = '<i class="fas fa-balance-scale me-2"></i>Compare Artworks';
            }
        }
    }
}

function hideResults(type) {
    const resultsElement = document.getElementById(`${type}Results`);
    if (resultsElement) {
        resultsElement.style.display = 'none';
    }
}

function showError(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    errorModal.show();
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed`;
    toast.style.cssText = 'bottom: 20px; right: 20px; z-index: 1060;';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Clean up after toast is hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function checkApiStatus() {
    fetch('/health')
        .then(response => response.json())
        .then(data => {
            console.log('Enhanced API Status:', data);
            
            if (data.features) {
                updateFeatureStatus(data.features);
            }
        })
        .catch(error => {
            console.warn('Could not check API status:', error);
        });
}

function updateFeatureStatus(features) {
    // Update UI to show which features are available
    const featureElements = document.querySelectorAll('[data-feature]');
    featureElements.forEach(element => {
        const featureName = element.dataset.feature;
        if (features[featureName] === 'available') {
            element.classList.add('feature-available');
            element.classList.remove('feature-unavailable');
        } else {
            element.classList.add('feature-unavailable');
            element.classList.remove('feature-available');
        }
    });
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Load history on page load
window.addEventListener('load', function() {
    loadAnalysisHistory();
});