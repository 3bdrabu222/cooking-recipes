// ============================================
// Modern Recipe Website JavaScript
// ============================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize animations on scroll
  initScrollAnimations();
  
  // Initialize search functionality
  initSearch();
  
  // Initialize smooth scrolling
  initSmoothScroll();
  
  // Initialize lazy loading for images
  initLazyLoading();
  
  // Initialize tooltips
  initTooltips();
  
  // Add ingredients functionality (for submit recipe page)
  initAddIngredients();
});

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  document.querySelectorAll('.animate-fade-in-up, .animate-fade-in, .animate-slide-in-right').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
  const searchInputs = document.querySelectorAll('.search-input, input[name="searchTerm"]');
  
  searchInputs.forEach(input => {
    // Add search icon if not present
    if (!input.parentElement.querySelector('.search-icon')) {
      const icon = document.createElement('i');
      icon.className = 'bi bi-search search-icon';
      input.parentElement.style.position = 'relative';
      input.parentElement.insertBefore(icon, input);
      input.style.paddingLeft = '3rem';
    }
    
    // Add focus effect
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
    
    // Add enter key support
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        const form = this.closest('form');
        if (form) {
          form.submit();
        }
      }
    });
  });
}

// ============================================
// Smooth Scrolling
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ============================================
// Lazy Loading Images
// ============================================

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// Tooltips
// ============================================

function initTooltips() {
  // Initialize Bootstrap tooltips if available
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}

// ============================================
// Add Ingredients Functionality
// ============================================

function initAddIngredients() {
  const addIngredientsBtn = document.getElementById('addIngredientsBtn');
  const ingredientList = document.querySelector('.ingredientList');
  
  if (addIngredientsBtn && ingredientList) {
    const ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];
    
    if (ingredeintDiv) {
      addIngredientsBtn.addEventListener('click', function() {
        const newIngredients = ingredeintDiv.cloneNode(true);
        const input = newIngredients.getElementsByTagName('input')[0];
        if (input) {
          input.value = '';
          input.focus();
        }
        ingredientList.appendChild(newIngredients);
        
        // Add animation
        newIngredients.style.opacity = '0';
        newIngredients.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          newIngredients.style.transition = 'all 0.3s ease';
          newIngredients.style.opacity = '1';
          newIngredients.style.transform = 'translateY(0)';
        }, 10);
      });
    }
  }
}

// ============================================
// Card Hover Effects
// ============================================

document.querySelectorAll('.recipe-card, .card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// ============================================
// Loading States
// ============================================

function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  }
}

function hideLoading(element, content) {
  if (element && content) {
    element.innerHTML = content;
  }
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
  // Create back to top button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  backToTopBtn.className = 'btn btn-primary rounded-circle position-fixed';
  backToTopBtn.style.cssText = 'bottom: 30px; right: 30px; width: 50px; height: 50px; z-index: 1000; display: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2);';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopBtn);
  
  // Show/hide button on scroll
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'flex';
      backToTopBtn.style.alignItems = 'center';
      backToTopBtn.style.justifyContent = 'center';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });
  
  // Scroll to top on click
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize back to top button
initBackToTop();

// ============================================
// Form Validation Enhancement
// ============================================

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('is-invalid');
      } else {
        field.classList.remove('is-invalid');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'alert alert-danger mt-3';
      errorMsg.textContent = 'Please fill in all required fields.';
      form.appendChild(errorMsg);
      
      setTimeout(() => {
        errorMsg.remove();
      }, 3000);
    }
  });
});

// ============================================
// Image Error Handling
// ============================================

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = '/img/placeholder.jpg';
    this.alt = 'Image not available';
    this.style.opacity = '0.5';
  });
});

// ============================================
// Console Welcome Message
// ============================================

console.log('%c🍳 RecipeHub', 'font-size: 24px; font-weight: bold; color: #FF6B6B;');
console.log('%cWelcome to RecipeHub!', 'font-size: 16px; color: #2C3E50;');
console.log('%cPowered by TheMealDB API', 'font-size: 12px; color: #95A5A6;');
