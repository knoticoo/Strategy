// AI Art Platform - Main JavaScript Application
class ArtPlatform {
    constructor() {
        this.currentUser = null;
        this.selectedFiles = null;
        this.init();
    }

    init() {
        console.log('🎨 AI Art Platform initializing...');
        this.bindEvents();
        this.initializeUI();
        this.loadUserData();
        this.setupDragAndDrop();
        this.setupMobileNavigation();
        this.setupPWA();
        this.loadGallery(); // Load gallery on page load
    }

    bindEvents() {
        // Upload events
        const uploadInput = document.getElementById('artworkUpload');
        if (uploadInput) {
            uploadInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        const uploadForm = document.getElementById('artworkMetadata');
        if (uploadForm) {
            uploadForm.addEventListener('submit', this.handleUploadSubmit.bind(this));
        }
        
        // Navigation events
        document.querySelectorAll('.nav-link, .bottom-nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeUI() {
        // Initialize tooltips if available
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Initialize modals
            const authModalEl = document.getElementById('authModal');
            const artworkModalEl = document.getElementById('artworkModal');
            const analysisModalEl = document.getElementById('analysisModal');
            const enhancementModalEl = document.getElementById('enhancementModal');

            if (authModalEl) this.authModal = new bootstrap.Modal(authModalEl);
            if (artworkModalEl) this.artworkModal = new bootstrap.Modal(artworkModalEl);
            if (analysisModalEl) this.analysisModal = new bootstrap.Modal(analysisModalEl);
            if (enhancementModalEl) this.enhancementModal = new bootstrap.Modal(enhancementModalEl);
        }

        // Setup intersection observer for animations
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
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
                if (target && target.startsWith('#')) {
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
        console.log('File selected:', e.target.files);
        const files = e.target.files;
        this.processFiles(files);
    }

    handleDrop(e) {
        console.log('Files dropped');
        const dt = e.dataTransfer;
        const files = dt.files;
        this.processFiles(files);
    }

    processFiles(files) {
        if (files.length === 0) return;

        console.log('Processing files:', files.length);
        const validFiles = Array.from(files).filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            this.showToast('Please select valid image files', 'danger');
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
            this.showToast(`Invalid file type: ${file.name}`, 'danger');
            return false;
        }

        if (file.size > maxSize) {
            this.showToast(`File too large: ${file.name}`, 'danger');
            return false;
        }

        return true;
    }

    showUploadForm() {
        const uploadForm = document.getElementById('uploadForm');
        if (uploadForm) {
            uploadForm.style.display = 'block';
            this.scrollToSection('uploadForm');
        }
    }

    previewFiles(files) {
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
        if (form) {
            const existingPreview = form.querySelector('.file-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            form.appendChild(preview);
        }
    }

    async handleUploadSubmit(e) {
        e.preventDefault();
        console.log('Upload form submitted');
        
        if (!this.selectedFiles || this.selectedFiles.length === 0) {
            this.showToast('No files selected', 'danger');
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
            console.error('Upload error:', error);
            this.hideUploadProgress();
            this.showToast('Upload failed: ' + error.message, 'danger');
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('artwork', file);
        formData.append('title', document.getElementById('artworkTitle')?.value || file.name);
        formData.append('description', document.getElementById('artworkDescription')?.value || '');
        formData.append('is_public', document.getElementById('makePublic')?.checked || false);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    }

    showUploadProgress() {
        const progressDiv = document.getElementById('uploadProgress');
        if (progressDiv) {
            progressDiv.style.display = 'block';
            
            // Animate progress bar
            const progressBar = progressDiv.querySelector('.progress-bar');
            if (progressBar) {
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
        }
    }

    hideUploadProgress() {
        const progressDiv = document.getElementById('uploadProgress');
        if (progressDiv) {
            progressDiv.style.display = 'none';
            const progressBar = progressDiv.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }
    }

    resetUploadForm() {
        const uploadForm = document.getElementById('uploadForm');
        const metadataForm = document.getElementById('artworkMetadata');
        const uploadInput = document.getElementById('artworkUpload');
        
        if (uploadForm) uploadForm.style.display = 'none';
        if (metadataForm) metadataForm.reset();
        if (uploadInput) uploadInput.value = '';
        
        this.selectedFiles = null;
    }

    // Authentication methods
    showAuthModal(mode = 'login') {
        console.log('Showing auth modal:', mode);
        const title = mode === 'login' ? 'Welcome Back' : 'Join Our Community';
        
        const titleEl = document.getElementById('authModalTitle');
        if (titleEl) titleEl.textContent = title;
        
        const authContent = document.getElementById('authContent');
        if (authContent) {
            authContent.innerHTML = this.getAuthForm(mode);
            this.bindAuthEvents(mode);
        }
        
        if (this.authModal) {
            this.authModal.show();
        }
    }

    getAuthForm(mode) {
        if (mode === 'login') {
            return `
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginUsername" class="form-label">Username or Email</label>
                        <input type="text" class="form-control" id="loginUsername" name="username" required>
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="loginPassword" name="password" required>
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
                                <input type="text" class="form-control" id="registerUsername" name="username" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="registerDisplayName" class="form-label">Display Name</label>
                                <input type="text" class="form-control" id="registerDisplayName" name="display_name">
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="registerEmail" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="registerPassword" name="password" required minlength="6">
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                        <label class="form-check-label" for="agreeTerms">
                            I agree to the Terms of Service
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
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAuth(mode, new FormData(form));
            });
        }
    }

    async handleAuth(mode, formData) {
        console.log('Handling auth:', mode);
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
                if (this.authModal) this.authModal.hide();
                this.showToast(result.message, 'success');
                this.loadUserData();
                // Reload to update UI with user session
                setTimeout(() => window.location.reload(), 1000);
            } else {
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showToast('Authentication failed', 'danger');
        }
    }

    async loadUserData() {
        // Check if user elements are present in DOM (server-side rendered)
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            this.currentUser = { authenticated: true };
            const myArtworksSection = document.getElementById('my-artworks');
            if (myArtworksSection) {
                myArtworksSection.style.display = 'block';
            }
        }
    }

    // Gallery and artwork methods
    async loadGallery() {
        try {
            const response = await fetch('/gallery');
            if (response.ok) {
                const data = await response.json();
                this.displayGalleryItems(data.artworks || []);
            }
        } catch (error) {
            console.error('Failed to load gallery:', error);
            this.displayGalleryItems([]);
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
                        <img src="${item.thumbnail_path || item.image_path}" class="card-img-top" alt="${item.title}" 
                             onclick="artPlatform.showArtworkDetails(${item.id})">
                        <div class="artwork-overlay">
                            <div class="artwork-actions">
                                <button class="btn btn-sm btn-light" onclick="artPlatform.likeArtwork(${item.id})">
                                    <i class="fas fa-heart"></i> ${item.likes_count || 0}
                                </button>
                                <button class="btn btn-sm btn-light" onclick="artPlatform.analyzeArtwork(${item.id})">
                                    <i class="fas fa-brain"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title text-truncate">${item.title}</h6>
                        <p class="card-text text-muted small">by ${item.display_name || item.username}</p>
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
        console.log('Liking artwork:', artworkId);
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
                this.showToast(result.liked ? 'Liked!' : 'Unliked!', 'success');
                // Update UI to reflect new like status
                this.updateLikeButton(artworkId, result.liked, result.like_count);
            } else {
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Like error:', error);
            this.showToast('Failed to like artwork', 'danger');
        }
    }

    updateLikeButton(artworkId, liked, likeCount) {
        // Find and update like buttons for this artwork
        const likeButtons = document.querySelectorAll(`[onclick*="likeArtwork(${artworkId})"]`);
        likeButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = liked ? 'fas fa-heart text-danger' : 'fas fa-heart';
            }
            button.innerHTML = `<i class="${liked ? 'fas fa-heart text-danger' : 'fas fa-heart'}"></i> ${likeCount}`;
        });
    }

    async analyzeArtwork(artworkId) {
        console.log('Analyzing artwork:', artworkId);
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        this.showLoadingOverlay('Analyzing artwork with AI...');

        try {
            const response = await fetch(`/analyze/${artworkId}`, {
                method: 'POST'
            });

            const result = await response.json();
            this.hideLoadingOverlay();

            if (response.ok) {
                this.showAnalysisResults(result);
            } else {
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            this.hideLoadingOverlay();
            this.showToast('Analysis failed', 'danger');
        }
    }

    showAnalysisResults(analysis) {
        console.log('Showing analysis results:', analysis);
        const content = document.getElementById('analysisContent');
        if (!content) return;

        const textAnalysis = analysis.analysis.text_analysis || 'Analysis completed successfully.';
        
        content.innerHTML = `
            <div class="analysis-results">
                <div class="row mb-4">
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
                    <h6>AI Analysis</h6>
                    <div class="analysis-text p-3 bg-light rounded">
                        ${this.formatAnalysisText(textAnalysis)}
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
        
        if (this.analysisModal) {
            this.analysisModal.show();
        }
    }

    async exportAnalysis(analysisId) {
        console.log('Exporting analysis:', analysisId);
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
            } else {
                this.showToast('Export failed', 'danger');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Export failed', 'danger');
        }
    }

    // Enhancement methods
    async enhanceArtwork(artworkId) {
        console.log('Enhancing artwork:', artworkId);
        const content = document.getElementById('enhancementContent');
        if (!content) return;

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
                            <h6>Enhanced</h6>
                            <img id="enhancedPreview" class="img-fluid rounded">
                        </div>
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-success" onclick="artPlatform.downloadEnhanced()">
                            <i class="fas fa-download me-1"></i>Download Enhanced
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        if (this.enhancementModal) {
            this.enhancementModal.show();
        }
    }

    async applyEnhancement(artworkId, type) {
        console.log('Applying enhancement:', type, 'to artwork:', artworkId);
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
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Enhancement error:', error);
            this.hideLoadingOverlay();
            this.showToast('Enhancement failed', 'danger');
        }
    }

    async applyFilter(artworkId, filterType) {
        console.log('Applying filter:', filterType, 'to artwork:', artworkId);
        this.showLoadingOverlay('Applying filter...');

        try {
            const formData = new FormData();
            formData.append('filter_type', filterType);

            const response = await fetch(`/enhance/${artworkId}`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            this.hideLoadingOverlay();

            if (response.ok) {
                this.showEnhancementPreview(result);
            } else {
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Filter error:', error);
            this.hideLoadingOverlay();
            this.showToast('Filter failed', 'danger');
        }
    }

    showEnhancementPreview(result) {
        console.log('Showing enhancement preview');
        const previewDiv = document.getElementById('enhancementPreview');
        const previewImg = document.getElementById('enhancedPreview');
        
        if (previewDiv && previewImg) {
            previewDiv.style.display = 'block';
            previewImg.src = `data:image/jpeg;base64,${result.enhanced_image}`;
            this.currentEnhancement = result;
        }
    }

    downloadEnhanced() {
        if (this.currentEnhancement && this.currentEnhancement.enhanced_image) {
            const link = document.createElement('a');
            link.href = `data:image/jpeg;base64,${this.currentEnhancement.enhanced_image}`;
            link.download = `enhanced_artwork_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('Enhanced artwork downloaded!', 'success');
        }
    }

    // Utility methods
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
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

    formatAnalysisText(text) {
        // Convert markdown-style text to HTML
        return text
            .replace(/^# (.*$)/gm, '<h4 class="text-primary mt-3 mb-2">$1</h4>')
            .replace(/^## (.*$)/gm, '<h5 class="text-secondary mt-3 mb-2">$1</h5>')
            .replace(/^### (.*$)/gm, '<h6 class="text-dark mt-2 mb-2">$1</h6>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
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
        if (overlay) {
            const messageEl = overlay.querySelector('p');
            if (messageEl) messageEl.textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        console.log('Toast:', message, type);
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed`;
        toast.style.cssText = 'bottom: 20px; right: 20px; z-index: 1060;';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
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
        // Handle responsive changes if needed
    }

    showInstallPromotion() {
        const banner = document.createElement('div');
        banner.className = 'install-banner bg-primary text-white p-2';
        banner.innerHTML = `
            <div class="container">
                <div class="d-flex justify-content-between align-items-center">
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

    // Placeholder methods for missing functionality
    showArtworkDetails(artworkId) {
        console.log('Showing artwork details for:', artworkId);
        this.showToast('Artwork details feature coming soon!', 'info');
    }

    shareArtwork(artworkId) {
        console.log('Sharing artwork:', artworkId);
        if (navigator.share) {
            navigator.share({
                title: 'Check out this artwork!',
                url: window.location.href
            });
        } else {
            this.showToast('Sharing feature coming soon!', 'info');
        }
    }

    refreshArtworks() {
        console.log('Refreshing artworks');
        this.loadGallery();
        this.showToast('Gallery refreshed!', 'success');
    }

    // Community and feature methods
    async loadCommunity() {
        console.log('Loading community data');
        try {
            const response = await fetch('/community');
            if (response.ok) {
                const data = await response.json();
                this.displayCommunityData(data);
            }
        } catch (error) {
            console.error('Failed to load community:', error);
            this.showToast('Failed to load community data', 'danger');
        }
    }

    displayCommunityData(data) {
        console.log('Displaying community data:', data);
        this.showToast(`Community loaded: ${data.total_members} members, ${data.active_today} active today!`, 'info');
    }

    async loadChallenges() {
        console.log('Loading challenges');
        try {
            const response = await fetch('/challenges');
            if (response.ok) {
                const data = await response.json();
                this.displayChallenges(data.challenges);
            }
        } catch (error) {
            console.error('Failed to load challenges:', error);
            this.showToast('Failed to load challenges', 'danger');
        }
    }

    displayChallenges(challenges) {
        console.log('Displaying challenges:', challenges);
        
        // Create challenges modal content
        const challengesHtml = `
            <div class="challenges-list">
                <h5 class="mb-4">🏆 Active Art Challenges</h5>
                ${challenges.map(challenge => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-title">${challenge.title}</h6>
                                    <p class="card-text text-muted">${challenge.description}</p>
                                    <div class="row mt-2">
                                        <div class="col-sm-6">
                                            <small class="text-muted">
                                                <i class="fas fa-calendar me-1"></i>
                                                Deadline: ${challenge.deadline}
                                            </small>
                                        </div>
                                        <div class="col-sm-6">
                                            <small class="text-muted">
                                                <i class="fas fa-users me-1"></i>
                                                ${challenge.participants} participants
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <span class="badge bg-${challenge.status === 'ending_soon' ? 'warning' : 'primary'} mb-2">
                                        ${challenge.difficulty}
                                    </span>
                                    <br>
                                    <button class="btn btn-outline-primary btn-sm" onclick="artPlatform.joinChallenge(${challenge.id})">
                                        Join Challenge
                                    </button>
                                </div>
                            </div>
                            <div class="mt-2">
                                <strong>Prize:</strong> ${challenge.prize}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.showModal('Art Challenges', challengesHtml);
    }

    async joinChallenge(challengeId) {
        console.log('Joining challenge:', challengeId);
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        try {
            const response = await fetch(`/join_challenge/${challengeId}`, {
                method: 'POST'
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showToast(result.message, 'success');
            } else {
                this.showToast(result.error, 'danger');
            }
        } catch (error) {
            console.error('Join challenge error:', error);
            this.showToast('Failed to join challenge', 'danger');
        }
    }

    async loadLearning() {
        console.log('Loading learning resources');
        try {
            const response = await fetch('/learning');
            if (response.ok) {
                const data = await response.json();
                this.displayLearningResources(data);
            }
        } catch (error) {
            console.error('Failed to load learning resources:', error);
            this.showToast('Failed to load learning resources', 'danger');
        }
    }

    displayLearningResources(data) {
        console.log('Displaying learning resources:', data);
        
        const resourcesHtml = `
            <div class="learning-resources">
                <h5 class="mb-4">📚 Learning Resources</h5>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6>${data.your_progress.completed}</h6>
                            <small class="text-muted">Completed</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6>${data.your_progress.in_progress}</h6>
                            <small class="text-muted">In Progress</small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-center">
                            <h6>${data.your_progress.bookmarked}</h6>
                            <small class="text-muted">Bookmarked</small>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="resources-list">
                    ${data.resources.map(resource => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <h6 class="card-title">${resource.title}</h6>
                                        <p class="card-text text-muted">${resource.description}</p>
                                        <div class="d-flex gap-3">
                                            <small class="text-muted">
                                                <i class="fas fa-clock me-1"></i>${resource.duration}
                                            </small>
                                            <small class="text-muted">
                                                <i class="fas fa-signal me-1"></i>${resource.difficulty}
                                            </small>
                                            <small class="text-muted">
                                                <i class="fas fa-user me-1"></i>${resource.author}
                                            </small>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <span class="badge bg-info mb-2">${resource.type}</span>
                                        <br>
                                        <button class="btn btn-outline-success btn-sm" onclick="artPlatform.startLearning(${resource.id})">
                                            Start Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.showModal('Learning Resources', resourcesHtml);
    }

    startLearning(resourceId) {
        console.log('Starting learning resource:', resourceId);
        this.showToast('Learning feature coming soon! This will open the tutorial.', 'info');
    }

    async loadProfile() {
        console.log('Loading user profile');
        if (!this.currentUser) {
            this.showAuthModal('login');
            return;
        }

        try {
            const response = await fetch('/profile');
            if (response.ok) {
                const data = await response.json();
                this.displayProfile(data.stats);
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
            this.showToast('Failed to load profile', 'danger');
        }
    }

    displayProfile(stats) {
        console.log('Displaying profile:', stats);
        
        const profileHtml = `
            <div class="user-profile">
                <h5 class="mb-4">👤 Your Profile</h5>
                <div class="row text-center mb-4">
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="fas fa-images fa-2x text-primary mb-2"></i>
                                <h4>${stats.artwork_count}</h4>
                                <small class="text-muted">Artworks Uploaded</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="fas fa-heart fa-2x text-danger mb-2"></i>
                                <h4>${stats.likes_received}</h4>
                                <small class="text-muted">Likes Received</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <i class="fas fa-brain fa-2x text-success mb-2"></i>
                                <h4>${stats.analysis_count}</h4>
                                <small class="text-muted">Analyses Completed</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <button class="btn btn-primary me-2" onclick="artPlatform.editProfile()">
                        <i class="fas fa-edit me-1"></i>Edit Profile
                    </button>
                    <button class="btn btn-outline-secondary" onclick="artPlatform.downloadData()">
                        <i class="fas fa-download me-1"></i>Download My Data
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('My Profile', profileHtml);
    }

    editProfile() {
        this.showToast('Profile editing feature coming soon!', 'info');
    }

    downloadData() {
        this.showToast('Data download feature coming soon!', 'info');
    }

    // Community discussions
    joinDiscussions() {
        console.log('Opening community discussions');
        this.loadCommunity();
        this.showToast('Joining community discussions...', 'info');
    }

    viewChallenges() {
        console.log('Viewing challenges');
        this.loadChallenges();
    }

    startLearningJourney() {
        console.log('Starting learning journey');
        this.loadLearning();
    }

    // General modal display method
    showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('generalModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'generalModal';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="generalModalTitle"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="generalModalBody">
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Update content
        document.getElementById('generalModalTitle').textContent = title;
        document.getElementById('generalModalBody').innerHTML = content;

        // Show modal
        if (typeof bootstrap !== 'undefined') {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        } else {
            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }

    // Gallery loading
    async loadGallery() {
        try {
            const response = await fetch('/gallery');
            if (response.ok) {
                const data = await response.json();
                this.displayGalleryItems(data.artworks || []);
            }
        } catch (error) {
            console.error('Failed to load gallery:', error);
            this.displayGalleryItems([]);
        }
    }

    // Toggle view functionality 
    toggleView() {
        const grid = document.getElementById('galleryGrid');
        const button = document.getElementById('viewToggle');
        
        if (grid && button) {
            if (grid.classList.contains('row')) {
                // Switch to list view
                grid.className = 'list-view';
                button.innerHTML = '<i class="fas fa-th me-1"></i>Grid';
                this.showToast('Switched to list view', 'info');
            } else {
                // Switch to grid view
                grid.className = 'row';
                button.innerHTML = '<i class="fas fa-list me-1"></i>List';
                this.showToast('Switched to grid view', 'info');
            }
        }
    }
}

// Global functions for onclick handlers
window.showAuthModal = (mode) => artPlatform.showAuthModal(mode);
window.scrollToSection = (section) => artPlatform.scrollToSection(section);
window.cancelUpload = () => artPlatform.resetUploadForm();
window.toggleView = () => artPlatform.toggleView();
window.refreshArtworks = () => artPlatform.refreshArtworks();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Initializing AI Art Platform...');
    window.artPlatform = new ArtPlatform();
});

// Make artPlatform globally available
window.artPlatform = window.artPlatform || null;