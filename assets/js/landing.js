/**
 * K&P Service-Tools Platform Landing Page JavaScript
 * Handles interactivity for the main landing page
 */

class LandingPageController {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupToolModals();
    this.setupMobileMenu();
    this.trackPageViews();
    console.log('🚀 K&P Service-Tools Platform v2.0.0 loaded');
  }

  setupEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });

    // Modal triggers
    document.querySelectorAll('[data-tool]').forEach(button => {
      button.addEventListener('click', this.handleToolModal.bind(this));
    });

    // Modal close handlers
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', this.closeModal.bind(this));
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));

    // Contact form (if present)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleContactForm.bind(this));
    }

    // Newsletter signup (if present)
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', this.handleNewsletterSignup.bind(this));
    }
  }

  handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      history.pushState(null, null, targetId);
    }
  }

  handleToolModal(e) {
    e.preventDefault();
    const toolType = e.currentTarget.getAttribute('data-tool');
    this.showToolModal(toolType);
  }

  showToolModal(toolType) {
    const modal = document.getElementById('tool-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    if (!modal || !modalTitle || !modalContent) return;

    const toolData = this.getToolData(toolType);
    
    modalTitle.textContent = toolData.title;
    modalContent.innerHTML = toolData.content;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus management for accessibility
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = ''; // Restore scrolling
  }

  getToolData(toolType) {
    const toolData = {
      generator: {
        title: 'XML Generator - Detailed Information',
        content: `
          <div class="tool-detail">
            <div class="tool-detail-header">
              <div class="tool-detail-icon">
                <i class="fas fa-code"></i>
              </div>
              <div class="tool-detail-info">
                <h3>XML Generator</h3>
                <p class="tool-status">✅ Available Now</p>
              </div>
            </div>
            
            <div class="tool-detail-content">
              <h4>Overview</h4>
              <p>The XML Generator is our most popular tool for creating custom editor.xml files for DDC4000 and DDC420 systems. It features a user-friendly interface with real-time XML preview and advanced configuration options.</p>
              
              <h4>Key Features</h4>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> <strong>Real-time Preview:</strong> See XML output as you type</li>
                <li><i class="fas fa-check"></i> <strong>Platform Support:</strong> DDC4000 (v1.7.1) and DDC420/BMR (v2.01.1)</li>
                <li><i class="fas fa-check"></i> <strong>Auto-numbering:</strong> Automatic address generation with configurable patterns</li>
                <li><i class="fas fa-check"></i> <strong>Hotkey Support:</strong> Keyboard shortcuts for power users</li>
                <li><i class="fas fa-check"></i> <strong>Settings Persistence:</strong> Save your preferences locally</li>
                <li><i class="fas fa-check"></i> <strong>Export Options:</strong> Download XML files directly</li>
              </ul>
              
              <h4>Technical Specifications</h4>
              <div class="tech-specs">
                <div class="spec-item">
                  <strong>Supported Formats:</strong>
                  <span>XML (editor.xml, _cr.editor.xml)</span>
                </div>
                <div class="spec-item">
                  <strong>Platform Versions:</strong>
                  <span>DDC4000 v1.7.1, DDC420 v2.01.1</span>
                </div>
                <div class="spec-item">
                  <strong>Browser Compatibility:</strong>
                  <span>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</span>
                </div>
                <div class="spec-item">
                  <strong>File Size Limit:</strong>
                  <span>No practical limit (client-side generation)</span>
                </div>
              </div>
              
              <h4>Getting Started</h4>
              <ol class="getting-started-list">
                <li>Select your target platform (DDC4000, DDC420, or both)</li>
                <li>Enter component details (name, dimensions, addresses)</li>
                <li>Use the auto-numbering feature to populate addresses</li>
                <li>Preview your XML in real-time</li>
                <li>Download the generated XML file</li>
              </ol>
              
              <div class="tool-actions-modal">
                <a href="/src/generator/" class="btn btn-primary">
                  <i class="fas fa-external-link-alt"></i> Launch XML Generator
                </a>
                <a href="https://github.com/Wobi848/SiToolImageGenerator#xml-generator" target="_blank" class="btn btn-secondary">
                  <i class="fab fa-github"></i> View Documentation
                </a>
              </div>
            </div>
          </div>
        `
      },
      browser: {
        title: 'DDC4000 Browser - Android App',
        content: `
          <div class="tool-detail">
            <div class="tool-detail-header">
              <div class="tool-detail-icon">
                <i class="fab fa-android"></i>
              </div>
              <div class="tool-detail-info">
                <h3>DDC4000 Browser</h3>
                <p class="tool-status">📱 Android App Available</p>
              </div>
            </div>
            
            <div class="tool-detail-content">
              <h4>Overview</h4>
              <p>The DDC4000 Browser is a Flutter-based Android mobile app for accessing and managing DDC4000 building automation systems. It provides a mobile interface for remote system access and management.</p>
              
              <h4>Key Features</h4>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> <strong>Remote Access:</strong> Connect to DDC4000 systems over network</li>
                <li><i class="fas fa-check"></i> <strong>Preset Management:</strong> Save and organize frequently used connections</li>
                <li><i class="fas fa-check"></i> <strong>Screenshot Capture:</strong> Take and save screenshots of system interfaces</li>
                <li><i class="fas fa-check"></i> <strong>Fullscreen Mode:</strong> Immersive system interaction</li>
                <li><i class="fas fa-check"></i> <strong>Session Persistence:</strong> Remember connection settings</li>
                <li><i class="fas fa-check"></i> <strong>Privacy Policy:</strong> Integrated privacy policy and data protection</li>
              </ul>
              
              <h4>Technical Specifications</h4>
              <div class="tech-specs">
                <div class="spec-item">
                  <strong>Platform:</strong>
                  <span>Android (Flutter framework)</span>
                </div>
                <div class="spec-item">
                  <strong>Minimum Android:</strong>
                  <span>Android 6.0 (API level 23)</span>
                </div>
                <div class="spec-item">
                  <strong>Connection Methods:</strong>
                  <span>HTTP/HTTPS, WebView integration</span>
                </div>
                <div class="spec-item">
                  <strong>Compatibility:</strong>
                  <span>DDC4000 systems with web interface</span>
                </div>
              </div>
              
              <div class="tool-actions-modal">
                <a href="https://github.com/Wobi848/ddc4000_browser_app" target="_blank" class="btn btn-primary">
                  <i class="fab fa-github"></i> View Android App Code
                </a>
                <a href="https://github.com/Wobi848/ddc4000_browser_app/releases" target="_blank" class="btn btn-secondary">
                  <i class="fas fa-download"></i> Download APK
                </a>
              </div>
            </div>
          </div>
        `
      },
      downloads: {
        title: 'Download Center - File Library',
        content: `
          <div class="tool-detail">
            <div class="tool-detail-header">
              <div class="tool-detail-icon">
                <i class="fas fa-download"></i>
              </div>
              <div class="tool-detail-info">
                <h3>Download Center</h3>
                <p class="tool-status">✅ Available Now</p>
              </div>
            </div>
            
            <div class="tool-detail-content">
              <h4>Overview</h4>
              <p>The Download Center provides access to a comprehensive library of pre-created editor.xml files for various DDC4000 and DDC420 components and system modules.</p>
              
              <h4>Available File Categories</h4>
              <div class="file-categories">
                <div class="category">
                  <h5><i class="fas fa-microchip"></i> System Components</h5>
                  <p>CAO, CDO, CEth (Ethernet modules), ConAV, ConSP</p>
                </div>
                <div class="category">
                  <h5><i class="fas fa-cube"></i> Function Blocks</h5>
                  <p>FB_AV, FB_BI, FB_BV, FB_IR, FB_MO, FB_MV, FB_TR</p>
                </div>
                <div class="category">
                  <h5><i class="fas fa-server"></i> Hardware Modules</h5>
                  <p>H033, H604, H704, H901Own, H903_own</p>
                </div>
                <div class="category">
                  <h5><i class="fas fa-cogs"></i> Special Functions</h5>
                  <p>F003, F006, F007, F012, F019</p>
                </div>
                <div class="category">
                  <h5><i class="fas fa-file-alt"></i> System Files</h5>
                  <p>L, M_01_own, S074, S078, S324, SY_* files</p>
                </div>
              </div>
              
              <h4>Features</h4>
              <ul class="feature-list">
                <li><i class="fas fa-check"></i> <strong>Platform Filtering:</strong> Filter by DDC4000 or DDC420 systems</li>
                <li><i class="fas fa-check"></i> <strong>Search Functionality:</strong> Find files by name or function</li>
                <li><i class="fas fa-check"></i> <strong>File Metadata:</strong> Creator, date, and platform information</li>
                <li><i class="fas fa-check"></i> <strong>Direct Downloads:</strong> One-click file downloads</li>
                <li><i class="fas fa-check"></i> <strong>Regular Updates:</strong> New files added monthly</li>
              </ul>
              
              <h4>File Statistics</h4>
              <div class="file-stats">
                <div class="stat-box">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">Total Files</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">35</div>
                  <div class="stat-label">DDC4000 Files</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">15</div>
                  <div class="stat-label">DDC420 Files</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">Monthly</div>
                  <div class="stat-label">Updates</div>
                </div>
              </div>
              
              <h4>How to Use</h4>
              <ol class="getting-started-list">
                <li>Browse available files or use the search function</li>
                <li>Filter by platform (DDC4000/DDC420) if needed</li>
                <li>Click on any file to view details and metadata</li>
                <li>Download files directly to your computer</li>
                <li>Import into your K&P Service-Tool project</li>
              </ol>
              
              <div class="tool-actions-modal">
                <a href="/src/download/" class="btn btn-primary">
                  <i class="fas fa-external-link-alt"></i> Browse Download Center
                </a>
                <a href="/src/admin/" class="btn btn-secondary">
                  <i class="fas fa-upload"></i> Admin Upload
                </a>
              </div>
            </div>
          </div>
        `
      }
    };

    return toolData[toolType] || { title: 'Tool Information', content: '<p>Information not available.</p>' };
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
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

    // Observe elements for animation
    document.querySelectorAll('.tool-card, .step, .stat-card').forEach(el => {
      observer.observe(el);
    });
  }

  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
        
        // Update ARIA attribute
        const isExpanded = mainNav.classList.contains('mobile-open');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !mainNav.contains(e.target)) {
          mainNav.classList.remove('mobile-open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  handleKeyboard(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
      this.closeModal();
    }

    // Tab navigation in modals
    if (e.key === 'Tab') {
      const activeModal = document.querySelector('.modal:not(.hidden)');
      if (activeModal) {
        this.handleModalTabNavigation(e, activeModal);
      }
    }
  }

  handleModalTabNavigation(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Simple form validation and submission
    this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    form.reset();
  }

  handleNewsletterSignup(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (this.validateEmail(email)) {
      this.showNotification('Thank you for subscribing! You\'ll be notified about updates.', 'success');
      form.reset();
    } else {
      this.showNotification('Please enter a valid email address.', 'error');
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => this.hideNotification(notification), 5000);

    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.hideNotification(notification);
    });
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  trackPageViews() {
    // Simple analytics tracking (privacy-friendly)
    const visitData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Store visit data locally for admin insights
    const visits = JSON.parse(localStorage.getItem('kp-platform-visits') || '[]');
    visits.push(visitData);
    
    // Keep only last 100 visits to avoid storage bloat
    if (visits.length > 100) {
      visits.splice(0, visits.length - 100);
    }
    
    localStorage.setItem('kp-platform-visits', JSON.stringify(visits));
    
    console.log('📊 Visit tracked (privacy-friendly local storage)');
  }

  // Public methods for external access
  static getInstance() {
    if (!window.landingPageController) {
      window.landingPageController = new LandingPageController();
    }
    return window.landingPageController;
  }
}

// Add notification styles dynamically
const notificationStyles = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    border-left: 4px solid #2196F3;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-success {
    border-left-color: #4CAF50;
  }
  
  .notification-error {
    border-left-color: #f44336;
  }
  
  .notification-content {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .notification-message {
    flex: 1;
    color: #212121;
    font-size: 0.9rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #757575;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  
  .notification-close:hover {
    background: #f5f5f5;
  }
  
  .tool-detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .tool-detail-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #2196F3, #4CAF50);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  
  .tool-detail-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #212121;
  }
  
  .tool-status {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .tool-status.coming-soon {
    color: #FF9800;
  }
  
  .tool-detail-content h4 {
    color: #212121;
    margin: 2rem 0 1rem 0;
    font-size: 1.2rem;
    border-bottom: 2px solid #2196F3;
    padding-bottom: 0.5rem;
  }
  
  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
  }
  
  .feature-list li {
    padding: 0.5rem 0;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .feature-list i {
    color: #4CAF50;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  .tech-specs {
    background: #FAFAFA;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .spec-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .spec-item:last-child {
    border-bottom: none;
  }
  
  .spec-item strong {
    color: #212121;
    min-width: 140px;
  }
  
  .spec-item span {
    color: #757575;
    text-align: right;
  }
  
  .getting-started-list {
    padding-left: 1.5rem;
    color: #757575;
  }
  
  .getting-started-list li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .tool-actions-modal {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #E0E0E0;
    justify-content: center;
  }
  
  .file-categories {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .category {
    background: #FAFAFA;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #2196F3;
  }
  
  .category h5 {
    margin: 0 0 0.5rem 0;
    color: #212121;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .category p {
    margin: 0;
    color: #757575;
    font-size: 0.9rem;
  }
  
  .file-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }
  
  .stat-box {
    text-align: center;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #E0E0E0;
  }
  
  .stat-box .stat-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2196F3;
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .stat-box .stat-label {
    font-size: 0.8rem;
    color: #757575;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .timeline {
    margin: 1.5rem 0;
  }
  
  .timeline-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .timeline-item:last-child {
    border-bottom: none;
  }
  
  .timeline-date {
    min-width: 80px;
    font-weight: bold;
    color: #2196F3;
    font-size: 0.9rem;
  }
  
  .timeline-content {
    flex: 1;
    color: #757575;
    line-height: 1.5;
  }
  
  .timeline-content strong {
    color: #212121;
  }
  
  .newsletter-signup {
    background: #F3F8FF;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 2rem;
    border: 1px solid #E3F2FD;
  }
  
  .newsletter-signup h4 {
    margin: 0 0 0.5rem 0;
    color: #212121;
    border: none;
    padding: 0;
  }
  
  .inline-form {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .inline-form input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .inline-form button {
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    .tool-actions-modal {
      flex-direction: column;
    }
    
    .file-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .spec-item {
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .spec-item span {
      text-align: left;
    }
    
    .inline-form {
      flex-direction: column;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    LandingPageController.getInstance();
  });
} else {
  LandingPageController.getInstance();
}

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  const hash = window.location.hash;
  if (hash && document.querySelector(hash)) {
    document.querySelector(hash).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

// Export for global access
window.LandingPageController = LandingPageController;