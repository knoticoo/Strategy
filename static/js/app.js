// AI Art Platform - Main JavaScript Application
class ArtPlatform {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeUI();
        this.loadUserData();
        this.loadGallery();
        this.setupDragAndDrop();
        this.setupMobileNavigation();
        this.setupPWA();
    }

    bindEvents() {
        // Upload events
        document.getElementById('artworkUpload')?.addEventListener('change', this.handleFileSelect.bind(this));
        document.getElementById('artworkMetadata')?.addEventListener('submit', this.handleUploadSubmit.bind(this));
        
        // Navigation events
        document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Gallery events
        document.getElementById('gallerySearch')?.addEventListener('input', this.debounce(this.searchGallery.bind(this), 300));
        document.getElementById('galleryStyle')?.addEventListener('change', this.filterGallery.bind(this));
        document.getElementById('gallerySortBy')?.addEventListener('change', this.sortGallery.bind(this));
    }

    initializeUI() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Initialize modals
        this.authModal = new bootstrap.Modal(document.getElementById('authModal'));
        this.artworkModal = new bootstrap.Modal(document.getElementById('artworkModal'));
        this.analysisModal = new bootstrap.Modal(document.getElementById('analysisModal'));
        this.enhancementModal = new bootstrap.Modal(document.getElementById('enhancementModal'));

        // Setup intersection observer for animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .card').forEach(el => {
            observer.observe(el);
        });
    }

    setupDragAndDrop() {
        const uploadZone = document.querySelector('.upload-zone');
        if (!uploadZone) return;

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('drag-over'), false);
        });

        uploadZone.addEventListener('drop', this.handleDrop.bind(this), false);
    }

    setupMobileNavigation() {
        // Bottom navigation for mobile
        document.querySelectorAll('.bottom-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                document.querySelectorAll('.bottom-nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll to section
                const target = link.getAttribute('href');
                if (target.startsWith('#')) {
                    this.scrollToSection(target.substring(1));
                }
            });
        });
    }

    setupPWA() {
        // Check if app is installed
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPromotion();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            this.hideInstallPromotion();
            this.showToast('App installed successfully!', 'success');
        });
    }

    // File handling methods
    handleFileSelect(e) {
        const files = e.target.files;
        this.processFiles(files);
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        const validFiles = Array.from(files).filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            this.showToast('Please select valid image files', 'error');
            return;
        }

        this.selectedFiles = validFiles;
        this.showUploadForm();
        this.previewFiles(validFiles);
    }

    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        const maxSize = 16 * 1024 * 1024; // 16MB

        if (!validTypes.includes(file.type)) {
            this.showToast(`Invalid file type: ${file.name}`, 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showToast(`File too large: ${file.name}`, 'error');
            return false;
        }

        return true;
    }

    showUploadForm() {
        document.getElementById('uploadForm').style.display = 'block';
        this.scrollToSection('uploadForm');
    }

    previewFiles(files) {
        // Add file preview to upload form
        const preview = document.createElement('div');
        preview.className = 'file-preview mt-3';
        preview.innerHTML = `
            <h6>Selected Files (${files.length})</h6>
            <div class="row">
                ${files.map((file, index) => `
                    <div class="col-md-6 col-lg-4 mb-2">
                        <div class="card">
                            <div class="card-body text-center p-2">
                                <i class="fas fa-image fa-2x text-primary mb-2"></i>
                                <small class="d-block text-truncate">${file.name}</small>
                                <small class="text-muted">${this.formatFileSize(file.size)}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        const form = document.getElementById('uploadForm');
        const existingPreview = form.querySelector('.file-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        form.appendChild(preview);
    }

    async handleUploadSubmit(e) {
        e.preventDefault();
        
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
            this.showToast('No files selected', 'error');
            return;
        }

        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        this.showUploadProgress();

        try {
            const uploadPromises = this.selectedFiles.map(file => this.uploadFile(file));
            const results = await Promise.all(uploadPromises);
            
            this.hideUploadProgress();
            this.showToast(`Successfully uploaded ${results.length} artwork(s)!`, 'success');
            this.resetUploadForm();
            this.refreshArtworks();
            
        } catch (error) {
            this.hideUploadProgress();
            this.showToast('Upload failed: ' + error.message, 'error');
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('artwork', file);
        formData.append('title', document.getElementById('artworkTitle').value || file.name);
        formData.append('description', document.getElementById('artworkDescription').value);
        formData.append('is_public', document.getElementById('makePublic').checked);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    }

    showUploadProgress() {
        document.getElementById('uploadProgress').style.display = 'block';
        // Animate progress bar
        const progressBar = document.querySelector('#uploadProgress .progress-bar');
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 30;
            if (width >= 90) {
                clearInterval(interval);
                width = 90;
            }
            progressBar.style.width = width + '%';
        }, 200);
    }

    hideUploadProgress() {
        document.getElementById('uploadProgress').style.display = 'none';
        document.querySelector('#uploadProgress .progress-bar').style.width = '0%';
    }

    resetUploadForm() {
        document.getElementById('uploadForm').style.display = 'none';
        document.getElementById('artworkMetadata').reset();
        document.getElementById('artworkUpload').value = '';
        this.selectedFiles = null;
    }

    // Authentication methods
    showAuthModal(mode = 'login') {
        const title = mode === 'login' ? 'Welcome Back' : 'Join Our Community';
        document.getElementById('authModalTitle').textContent = title;
        
        const authContent = document.getElementById('authContent');
        authContent.innerHTML = this.getAuthForm(mode);
        
        this.authModal.show();
        this.bindAuthEvents(mode);
    }

    getAuthForm(mode) {
        if (mode === 'login') {
            return `
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginUsername" class="form-label">Username or Email</label>
                        <input type="text" class="form-control" id="loginUsername" required>
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="loginPassword" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </div>
                    <div class="text-center mt-3">
                        <a href="#" onclick="artPlatform.showAuthModal('register')">Don't have an account? Sign up</a>
                    </div>
                </form>
            `;
        } else {
            return `
                <form id="registerForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="registerUsername" class="form-label">Username</label>
                                <input type="text" class="form-control" id="registerUsername" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="registerDisplayName" class="form-label">Display Name</label>
                                <input type="text" class="form-control" id="registerDisplayName">
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="registerEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="registerPassword" required minlength="6">
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                        <label class="form-check-label" for="agreeTerms">
                            I agree to the <a href="#" target="_blank">Terms of Service</a>
                        </label>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </div>
                    <div class="text-center mt-3">
                        <a href="#" onclick="artPlatform.showAuthModal('login')">Already have an account? Sign in</a>
                    </div>
                </form>
            `;
        }
    }

    bindAuthEvents(mode) {
        const form = document.getElementById(mode + 'Form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAuth(mode, new FormData(form));
        });
    }

    async handleAuth(mode, formData) {
        try {
            const data = Object.fromEntries(formData);
            
            const response = await fetch(`/${mode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.authModal.hide();
                this.showToast(result.message, 'success');
                this.loadUserData();
                window.location.reload(); // Refresh to update UI
            } else {
                this.showToast(result.error, 'error');
            }
        } catch (error) {
            this.showToast('Authentication failed', 'error');
        }
    }

    async loadUserData() {
        // This would typically fetch user data from the server
        // For now, check if user elements are present in DOM
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            this.currentUser = { authenticated: true };
            document.getElementById('my-artworks').style.display = 'block';
        }
    }

    // Gallery methods
    async loadGallery() {
        try {
            const response = await fetch('/gallery');
            if (response.ok) {
                const html = await response.text();
                // Parse and display gallery items
                this.displayGalleryItems([]);
            }
        } catch (error) {
            console.error('Failed to load gallery:', error);
        }
    }

    displayGalleryItems(items) {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-images fa-3x mb-3"></i>
                    <p>No artworks in gallery yet. Be the first to share!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(item => this.createGalleryItem(item)).join('');
    }

    createGalleryItem(item) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card artwork-card border-0 shadow-sm h-100">
                    <div class="artwork-image">
                        <img src="${item.thumbnail || item.image}" class="card-img-top" alt="${item.title}" 
                             onclick="artPlatform.showArtworkDetails(${item.id})">
                        <div class="artwork-overlay">
                            <div class="artwork-actions">
                                <button class="btn btn-sm btn-light" onclick="artPlatform.likeArtwork(${item.id})">
                                    <i class="fas fa-heart"></i> ${item.likes}
                                </button>
                                <button class="btn btn-sm btn-light" onclick="artPlatform.analyzeArtwork(${item.id})">
                                    <i class="fas fa-brain"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title text-truncate">${item.title}</h6>
                        <p class="card-text text-muted small">by ${item.artist}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${this.formatDate(item.created_at)}</small>
                            <div class="btn-group" role="group">
                                <button class="btn btn-outline-primary btn-sm" onclick="artPlatform.showArtworkDetails(${item.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="artPlatform.shareArtwork(${item.id})">
                                    <i class="fas fa-share"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Artwork interaction methods
    async likeArtwork(artworkId) {
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        try {
            const response = await fetch(`/like/${artworkId}`, {
                method: 'POST'
            });

            const result = await response.json();
            
            if (response.ok) {
                // Update UI to reflect new like status
                this.updateLikeButton(artworkId, result.liked, result.like_count);
            }
        } catch (error) {
            this.showToast('Failed to like artwork', 'error');
        }
    }

    async analyzeArtwork(artworkId) {
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        this.showLoadingOverlay('Analyzing artwork...');

        try {
            const response = await fetch(`/analyze/${artworkId}`, {
                method: 'POST'
            });

            const result = await response.json();
            this.hideLoadingOverlay();

            if (response.ok) {
                this.showAnalysisResults(result);
            } else {
                this.showToast(result.error, 'error');
            }
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Analysis failed', 'error');
        }
    }

    showAnalysisResults(analysis) {
        const content = document.getElementById('analysisContent');
        content.innerHTML = `
            <div class="analysis-results">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Composition Score</h6>
                        <div class="progress mb-3">
                            <div class="progress-bar bg-primary" style="width: ${analysis.analysis.composition.score}%">
                                ${Math.round(analysis.analysis.composition.score)}%
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Color Score</h6>
                        <div class="progress mb-3">
                            <div class="progress-bar bg-success" style="width: ${analysis.analysis.color.score}%">
                                ${Math.round(analysis.analysis.color.score)}%
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h6>Recommendations</h6>
                    <ul class="list-group list-group-flush">
                        ${analysis.recommendations.map(rec => `
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">${rec.category}</h6>
                                        <p class="mb-1">${rec.suggestion}</p>
                                    </div>
                                    <span class="badge bg-${rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'secondary'}">${rec.priority}</span>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="mt-4 text-center">
                    <button class="btn btn-primary me-2" onclick="artPlatform.exportAnalysis(${analysis.analysis_id})">
                        <i class="fas fa-file-pdf me-1"></i>Export PDF
                    </button>
                    <button class="btn btn-outline-secondary" onclick="artPlatform.enhanceArtwork(${analysis.analysis_id})">
                        <i class="fas fa-magic me-1"></i>Enhance
                    </button>
                </div>
            </div>
        `;
        
        this.analysisModal.show();
    }

    async exportAnalysis(analysisId) {
        try {
            const response = await fetch(`/export/pdf/${analysisId}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `art_analysis_${analysisId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showToast('Analysis exported successfully!', 'success');
            }
        } catch (error) {
            this.showToast('Export failed', 'error');
        }
    }

    // Enhancement methods
    async enhanceArtwork(artworkId) {
        const content = document.getElementById('enhancementContent');
        content.innerHTML = `
            <div class="enhancement-tools">
                <h6>Choose Enhancement Type</h6>
                <div class="row">
                    <div class="col-md-6">
                        <h6>Basic Enhancements</h6>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="artPlatform.applyEnhancement(${artworkId}, 'brightness')">
                                <i class="fas fa-sun me-2"></i>Brightness
                            </button>
                            <button class="btn btn-outline-primary" onclick="artPlatform.applyEnhancement(${artworkId}, 'contrast')">
                                <i class="fas fa-adjust me-2"></i>Contrast
                            </button>
                            <button class="btn btn-outline-primary" onclick="artPlatform.applyEnhancement(${artworkId}, 'saturation')">
                                <i class="fas fa-palette me-2"></i>Saturation
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h6>Artistic Filters</h6>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-success" onclick="artPlatform.applyFilter(${artworkId}, 'oil_painting')">
                                <i class="fas fa-paint-brush me-2"></i>Oil Painting
                            </button>
                            <button class="btn btn-outline-success" onclick="artPlatform.applyFilter(${artworkId}, 'watercolor')">
                                <i class="fas fa-tint me-2"></i>Watercolor
                            </button>
                            <button class="btn btn-outline-success" onclick="artPlatform.applyFilter(${artworkId}, 'pencil_sketch')">
                                <i class="fas fa-pencil-alt me-2"></i>Pencil Sketch
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="enhancementPreview" class="mt-4" style="display: none;">
                    <h6>Preview</h6>
                    <div class="row">
                        <div class="col-6 text-center">
                            <h6>Original</h6>
                            <img id="originalPreview" class="img-fluid rounded">
                        </div>
                        <div class="col-6 text-center">
                            <h6>Enhanced</h6>
                            <img id="enhancedPreview" class="img-fluid rounded">
                        </div>
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-success" onclick="artPlatform.saveEnhancement()">
                            <i class="fas fa-save me-1"></i>Save Enhancement
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.enhancementModal.show();
    }

    async applyEnhancement(artworkId, type) {
        this.showLoadingOverlay('Applying enhancement...');

        try {
            const formData = new FormData();
            formData.append('enhancement_type', type);

            const response = await fetch(`/enhance/${artworkId}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            this.hideLoadingOverlay();

            if (response.ok) {
                this.showEnhancementPreview(result);
            } else {
                this.showToast(result.error, 'error');
            }
        } catch (error) {
            this.hideLoadingOverlay();
            this.showToast('Enhancement failed', 'error');
        }
    }

    showEnhancementPreview(result) {
        document.getElementById('enhancementPreview').style.display = 'block';
        document.getElementById('enhancedPreview').src = `data:image/jpeg;base64,${result.enhanced_image}`;
        this.currentEnhancement = result;
    }

    // Utility methods
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Account for fixed header
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    showLoadingOverlay(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        overlay.querySelector('p').textContent = message;
        overlay.style.display = 'flex';
    }

    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showToast(message, type = 'info') {
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
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    handleNavigation(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            this.scrollToSection(href.substring(1));
        }
    }

    handleScroll() {
        // Update navigation state based on scroll position
        const sections = ['home', 'upload', 'gallery', 'community'];
        const scrollPosition = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Update active navigation links
                    document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }

    handleResize() {
        // Handle responsive changes
        if (window.innerWidth < 768) {
            // Mobile adjustments
        } else {
            // Desktop adjustments
        }
    }

    showInstallPromotion() {
        const banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="container">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <span><i class="fas fa-mobile-alt me-2"></i>Install AI Art Platform for the best experience</span>
                    <div>
                        <button class="btn btn-sm btn-light me-2" onclick="artPlatform.installApp()">Install</button>
                        <button class="btn btn-sm btn-outline-light" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
    }

    hideInstallPromotion() {
        const banner = document.querySelector('.install-banner');
        if (banner) {
            banner.remove();
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            this.hideInstallPromotion();
        }
    }
}

// Global functions for onclick handlers
window.showAuthModal = (mode) => artPlatform.showAuthModal(mode);
window.scrollToSection = (section) => artPlatform.scrollToSection(section);
window.cancelUpload = () => artPlatform.resetUploadForm();
window.toggleView = () => console.log('Toggle view');
window.refreshArtworks = () => console.log('Refresh artworks');

// Initialize the application
const artPlatform = new ArtPlatform();

// Make artPlatform globally available
window.artPlatform = artPlatform;