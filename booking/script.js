/**
 * Premium Transportation Booking Form
 * Handles form validation, interactions, and submission
 */

document.addEventListener('DOMContentLoaded', () => {
  // Form elements
  const bookingForm = document.getElementById('bookingForm');
  const submitButton = document.getElementById('submitButton');
  const successMessage = document.getElementById('successMessage');
  const newBookingButton = document.getElementById('newBookingButton');
  const childSeatSection = document.querySelector('.child-seat-section');
  const childPassengers = document.getElementById('childPassengers');
  
  // Current date for date picker min attribute
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('pickupDate').min = today;
  
  // Form validation state
  let formValid = false;
  
  /**
   * Initialize the form
   */
  const initForm = () => {
    // Add input event listeners to all required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('input', validateField);
      field.addEventListener('change', validateField);
      field.addEventListener('blur', validateField);
    });
    
    // Add change listener to child passengers dropdown
    childPassengers.addEventListener('change', toggleChildSeatSection);
    
    // Form submission handler
    bookingForm.addEventListener('submit', handleSubmit);
    
    // New booking button handler
    newBookingButton.addEventListener('click', resetForm);
    
    // Validate form on load
    validateForm();
  };
  
  /**
   * Toggle the visibility of child seat options based on child passengers selection
   */
  const toggleChildSeatSection = () => {
    const numChildren = parseInt(childPassengers.value, 10);
    if (numChildren > 0) {
      childSeatSection.classList.add('show');
    } else {
      childSeatSection.classList.remove('show');
    }
  };
  
  /**
   * Validate a single form field
   * @param {Event} event - The input event
   */
  const validateField = (event) => {
    const field = event.target;
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error classes
    field.classList.remove('error');
    
    // Custom validation based on field type
    switch (fieldId) {
      case 'fullName':
        if (field.value.trim() === '') {
          isValid = false;
          errorMessage = 'Please enter your full name';
        } else if (field.value.trim().length < 3) {
          isValid = false;
          errorMessage = 'Name must be at least 3 characters';
        }
        break;
        
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
        
      case 'phone':
        const phonePattern = /^[0-9\s\+\-\(\)]{8,20}$/;
        if (!phonePattern.test(field.value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;
        
      case 'pickupLocation':
      case 'dropoffLocation':
        if (field.value.trim() === '') {
          isValid = false;
          errorMessage = 'This field is required';
        } else if (field.value.trim().length < 5) {
          isValid = false;
          errorMessage = 'Please enter a more specific location';
        }
        break;
        
      case 'pickupDate':
        const selectedDate = new Date(field.value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        if (!field.value) {
          isValid = false;
          errorMessage = 'Please select a date';
        } else if (selectedDate < currentDate) {
          isValid = false;
          errorMessage = 'Date cannot be in the past';
        }
        break;
        
      case 'pickupTime':
        if (!field.value) {
          isValid = false;
          errorMessage = 'Please select a time';
        }
        break;
        
      case 'serviceType':
      case 'vehicleType':
      case 'adultPassengers':
      case 'paymentOption':
        if (!field.value || field.value === '') {
          isValid = false;
          errorMessage = 'Please make a selection';
        }
        break;
        
      case 'termsAgree':
        if (!field.checked) {
          isValid = false;
          errorMessage = 'You must agree to the terms and conditions';
        }
        break;
    }
    
    // Update error message and classes
    if (!isValid) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      field.classList.add('error');
    } else {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
    
    // Check if the entire form is valid
    validateForm();
    
    return isValid;
  };
  
  /**
   * Validate the entire form and update the submit button state
   */
  const validateForm = () => {
    const requiredFields = document.querySelectorAll('[required]');
    formValid = true;
    
    requiredFields.forEach(field => {
      // Check if field has a value (or is checked for checkboxes)
      let fieldValid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
      
      // Additional validation for specific field types
      if (fieldValid && field.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        fieldValid = emailPattern.test(field.value);
      }
      
      if (!fieldValid) {
        formValid = false;
      }
    });
    
    // Enable/disable submit button based on form validity
    submitButton.disabled = !formValid;
  };
  
  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Validate all fields one more time before submission
    const requiredFields = document.querySelectorAll('[required]');
    let allFieldsValid = true;
    
    requiredFields.forEach(field => {
      const event = { target: field };
      const isValid = validateField(event);
      if (!isValid) {
        allFieldsValid = false;
      }
    });
    
    if (!allFieldsValid) {
      // Scroll to the first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    
    // Simulate form submission
    setTimeout(() => {
      // Hide loading state
      submitButton.classList.remove('loading');
      
      // Show success message
      successMessage.classList.add('show');
    }, 2000);
  };
  
  /**
   * Reset the form to its initial state
   */
  const resetForm = () => {
    // Reset the form
    bookingForm.reset();
    
    // Hide success message
    successMessage.classList.remove('show');
    
    // Remove error classes
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.classList.remove('show'));
    
    // Hide child seat section
    childSeatSection.classList.remove('show');
    
    // Disable submit button
    submitButton.disabled = true;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  /**
   * Apply smooth scrolling for all anchor links
   */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };
  
  // Initialize the form and smooth scrolling
  initForm();
  initSmoothScroll();
});