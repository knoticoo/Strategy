// Main JavaScript for AI Art Analyzer

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Bind form events
    bindFormEvents();
    
    // Check API status
    checkApiStatus();
    
    // Initialize tooltips
    initializeTooltips();
}

function bindFormEvents() {
    // Analysis form
    const analyzeForm = document.getElementById('analyzeForm');
    if (analyzeForm) {
        analyzeForm.addEventListener('submit', handleAnalyzeSubmit);
    }
    
    // Enhancement form
    const enhanceForm = document.getElementById('enhanceForm');
    if (enhanceForm) {
        enhanceForm.addEventListener('submit', handleEnhanceSubmit);
    }
    
    // File input change events for preview
    const analyzeFile = document.getElementById('analyzeFile');
    if (analyzeFile) {
        analyzeFile.addEventListener('change', function(e) {
            previewImage(e.target, 'analyze');
        });
    }
    
    const enhanceFile = document.getElementById('enhanceFile');
    if (enhanceFile) {
        enhanceFile.addEventListener('change', function(e) {
            previewImage(e.target, 'enhance');
        });
    }
    
    // Download button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'downloadEnhanced' || e.target.closest('#downloadEnhanced')) {
            downloadEnhancedImage();
        }
    });
}

function handleAnalyzeSubmit(e) {
    e.preventDefault();
    
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
    showLoading('analyze');
    hideResults('analyze');
    
    // Make API call
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading('analyze');
        
        if (data.error) {
            showError(data.error);
        } else {
            showAnalysisResults(data);
        }
    })
    .catch(error => {
        hideLoading('analyze');
        showError('An error occurred while analyzing the image. Please try again.');
        console.error('Analysis error:', error);
    });
}

function handleEnhanceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const file = formData.get('artwork');
    
    if (!file || file.size === 0) {
        showError('Please select an image file to enhance.');
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
    showLoading('enhance');
    hideResults('enhance');
    
    // Make API call
    fetch('/enhance', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading('enhance');
        
        if (data.error) {
            showError(data.error);
        } else {
            showEnhanceResults(data);
        }
    })
    .catch(error => {
        hideLoading('enhance');
        showError('An error occurred while enhancing the image. Please try again.');
        console.error('Enhancement error:', error);
    });
}

function showAnalysisResults(data) {
    const resultsDiv = document.getElementById('analysisResults');
    const imageElement = document.getElementById('analyzedImage');
    const textElement = document.getElementById('analysisText');
    
    if (resultsDiv && imageElement && textElement) {
        // Set image
        imageElement.src = 'data:image/jpeg;base64,' + data.image_data;
        
        // Format and set analysis text
        textElement.innerHTML = formatAnalysisText(data.analysis);
        
        // Show results with animation
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('fade-in');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showEnhanceResults(data) {
    const resultsDiv = document.getElementById('enhanceResults');
    const originalImage = document.getElementById('originalImage');
    const enhancedImage = document.getElementById('enhancedImage');
    
    if (resultsDiv && originalImage && enhancedImage) {
        // Set images
        originalImage.src = 'data:image/jpeg;base64,' + data.original_image;
        enhancedImage.src = 'data:image/jpeg;base64,' + data.enhanced_image;
        
        // Store enhanced image data for download
        enhancedImage.dataset.imageData = data.enhanced_image;
        
        // Show results with animation
        resultsDiv.style.display = 'block';
        resultsDiv.classList.add('fade-in');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function formatAnalysisText(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\d+\.\s+\*\*(.*?)\*\*:/gm, '<h6 class="text-primary mt-3 mb-2">$1:</h6>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    
    return formatted;
}

function previewImage(input, type) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        if (!isValidImageFile(file)) {
            showError('Please select a valid image file.');
            input.value = '';
            return;
        }
        
        // Optional: Show preview (you can implement this if needed)
        console.log(`${type} file selected:`, file.name);
    }
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
            button.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>Processing...`;
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
            if (type === 'analyze') {
                button.innerHTML = '<i class="fas fa-brain me-2"></i>Analyze Artwork';
            } else {
                button.innerHTML = '<i class="fas fa-sparkles me-2"></i>Enhance Artwork';
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

function downloadEnhancedImage() {
    const enhancedImage = document.getElementById('enhancedImage');
    
    if (enhancedImage && enhancedImage.dataset.imageData) {
        // Create download link
        const link = document.createElement('a');
        link.href = 'data:image/jpeg;base64,' + enhancedImage.dataset.imageData;
        link.download = 'enhanced-artwork-' + Date.now() + '.jpg';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showToast('Enhanced image downloaded successfully!', 'success');
    } else {
        showError('No enhanced image available for download.');
    }
}

function checkApiStatus() {
    fetch('/health')
        .then(response => response.json())
        .then(data => {
            console.log('API Status:', data);
            
            if (!data.openai_configured) {
                showWarningBanner('OpenAI API key not configured. Analysis features may not work.');
            }
            
            if (data.diffusion_model === 'not loaded') {
                showWarningBanner('Image enhancement model is loading. Enhancement features may be temporarily unavailable.');
            }
        })
        .catch(error => {
            console.warn('Could not check API status:', error);
        });
}

function showWarningBanner(message) {
    const banner = document.createElement('div');
    banner.className = 'alert alert-warning alert-dismissible fade show position-fixed';
    banner.style.cssText = 'top: 70px; left: 50%; transform: translateX(-50%); z-index: 1050; max-width: 90%;';
    banner.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(banner);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (banner.parentNode) {
            banner.remove();
        }
    }, 10000);
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

function initializeTooltips() {
    // Initialize Bootstrap tooltips if any exist
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
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

// Add loading animation to page
function addPageLoadingAnimation() {
    const elements = document.querySelectorAll('.card, .hero-section');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize page loading animation
window.addEventListener('load', addPageLoadingAnimation);