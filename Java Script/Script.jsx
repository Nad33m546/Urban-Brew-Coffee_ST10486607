document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  const successBanner = document.getElementById('successBanner');
 
  const fields = {
    fullName: { el: document.getElementById('fullName'), errEl: document.getElementById('fullNameError') },
    email: { el: document.getElementById('email'), errEl: document.getElementById('emailError') },
    phone: { el: document.getElementById('phone'), errEl: document.getElementById('phoneError') },
    age: { el: document.getElementById('age'), errEl: document.getElementById('ageError') },
    password: { el: document.getElementById('password'), errEl: document.getElementById('passwordError') },
    confirmPassword: { el: document.getElementById('confirmPassword'), errEl: document.getElementById('confirmPasswordError') },
    bio: { el: document.getElementById('bio'), errEl: document.getElementById('bioError') }
  };
 
  if (!form || !successBanner || Object.values(fields).some(field => !field.el || !field.errEl)) {
    return;
  }
 
  function setError(field, message) {
    field.el.classList.add('error');
    field.el.classList.remove('success');
    field.errEl.textContent = '⚠ ' + message;
    field.errEl.classList.add('show');
  }
 
  function setSuccess(field) {
    field.el.classList.remove('error');
    field.el.classList.add('success');
    field.errEl.classList.remove('show');
    field.errEl.textContent = '';
  }
 
  function clearState(field) {
    field.el.classList.remove('error', 'success');
    field.errEl.classList.remove('show');
    field.errEl.textContent = '';
  }
 
  // ---- Individual validators, each returns true/false ----
 
  function validateFullName(showState = true) {
    const value = fields.fullName.el.value.trim();
    if (value.length === 0) {
      if (showState) setError(fields.fullName, 'Full name is required.');
      return false;
    }
    if (value.length < 2) {
      if (showState) setError(fields.fullName, 'Name must be at least 2 characters.');
      return false;
    }
    if (!/^[A-Za-z\s'-]+$/.test(value)) {
      if (showState) setError(fields.fullName, 'Name can only contain letters, spaces, hyphens, and apostrophes.');
      return false;
    }
    if (showState) setSuccess(fields.fullName);
    return true;
  }
 
  function validateEmail(showState = true) {
    const value = fields.email.el.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length === 0) {
      if (showState) setError(fields.email, 'Email address is required.');
      return false;
    }
    if (!pattern.test(value)) {
      if (showState) setError(fields.email, 'Enter a valid email address (e.g. name@example.com).');
      return false;
    }
    if (showState) setSuccess(fields.email);
    return true;
  }
 
  function validatePhone(showState = true) {
    const raw = fields.phone.el.value.trim();
    const digitsOnly = raw.replace(/[\s-]/g, '');
    if (raw.length === 0) {
      if (showState) setError(fields.phone, 'Phone number is required.');
      return false;
    }
    if (!/^\d{10}$/.test(digitsOnly)) {
      if (showState) setError(fields.phone, 'Phone number must be exactly 10 digits.');
      return false;
    }
    if (showState) setSuccess(fields.phone);
    return true;
  }
 
  function validateAge(showState = true) {
    const value = fields.age.el.value.trim();
    if (value.length === 0) {
      if (showState) setError(fields.age, 'Age is required.');
      return false;
    }
    if (!/^\d+$/.test(value)) {
      if (showState) setError(fields.age, 'Age must be a whole number.');
      return false;
    }
    const num = parseInt(value, 10);
    if (num < 13) {
      if (showState) setError(fields.age, 'You must be at least 13 years old.');
      return false;
    }
    if (num > 120) {
      if (showState) setError(fields.age, 'Enter a realistic age.');
      return false;
    }
    if (showState) setSuccess(fields.age);
    return true;
  }
 
  function getPasswordStrength(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score; // 0–5
  }
 
  function updateStrengthMeter() {
    const value = fields.password.el.value;
    const score = getPasswordStrength(value);
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    const pct = (score / 5) * 100;
    fill.style.width = pct + '%';
 
    if (value.length === 0) {
      fill.style.background = '#d4d8de';
      label.textContent = 'Use 8+ characters with a number and a symbol';
      label.style.color = '';
    } else if (score <= 2) {
      fill.style.background = '#c0392b';
      label.textContent = 'Weak password';
      label.style.color = '#c0392b';
    } else if (score <= 3) {
      fill.style.background = '#e0a020';
      label.textContent = 'Fair password';
      label.style.color = '#e0a020';
    } else if (score === 4) {
      fill.style.background = '#2e75b6';
      label.textContent = 'Good password';
      label.style.color = '#2e75b6';
    } else {
      fill.style.background = '#2e7d4f';
      label.textContent = 'Strong password';
      label.style.color = '#2e7d4f';
    }
  }
 
  function validatePassword(showState = true) {
    const value = fields.password.el.value;
    if (value.length === 0) {
      if (showState) setError(fields.password, 'Password is required.');
      return false;
    }
    if (value.length < 8) {
      if (showState) setError(fields.password, 'Password must be at least 8 characters.');
      return false;
    }
    if (!/[0-9]/.test(value)) {
      if (showState) setError(fields.password, 'Password must include at least one number.');
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      if (showState) setError(fields.password, 'Password must include at least one symbol.');
      return false;
    }
    if (showState) setSuccess(fields.password);
    return true;
  }
 
  function validateConfirmPassword(showState = true) {
    const value = fields.confirmPassword.el.value;
    const original = fields.password.el.value;
    if (value.length === 0) {
      if (showState) setError(fields.confirmPassword, 'Please confirm your password.');
      return false;
    }
    if (value !== original) {
      if (showState) setError(fields.confirmPassword, 'Passwords do not match.');
      return false;
    }
    if (showState) setSuccess(fields.confirmPassword);
    return true;
  }
 
  function validateBio(showState = true) {
    const value = fields.bio.el.value;
    if (value.length > 100) {
      if (showState) setError(fields.bio, 'Bio cannot exceed 100 characters.');
      return false;
    }
    if (showState) {
      if (value.length > 0) setSuccess(fields.bio);
      else clearState(fields.bio);
    }
    return true;
  }
 
  function updateBioCount() {
    const len = fields.bio.el.value.length;
    document.getElementById('bioCount').textContent = len + ' / 100';
  }
 
  // ---- Wire up live validation (validate on blur, clear-on-type for errors) ----
 
  fields.fullName.el.addEventListener('blur', () => validateFullName());
  fields.email.el.addEventListener('blur', () => validateEmail());
  fields.phone.el.addEventListener('blur', () => validatePhone());
  fields.age.el.addEventListener('blur', () => validateAge());
  fields.password.el.addEventListener('blur', () => validatePassword());
  fields.confirmPassword.el.addEventListener('blur', () => validateConfirmPassword());
  fields.bio.el.addEventListener('blur', () => validateBio());
 
  fields.password.el.addEventListener('input', updateStrengthMeter);
  fields.bio.el.addEventListener('input', updateBioCount);
 
  // Re-validate confirm password live if user edits password after already confirming
  fields.password.el.addEventListener('input', () => {
    if (fields.confirmPassword.el.value.length > 0) validateConfirmPassword();
  });
 
  // Clear error state as soon as user starts correcting a field
  Object.values(fields).forEach(field => {
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) {
        field.el.classList.remove('error');
        field.errEl.classList.remove('show');
      }
    });
  });
 
  // ---- Form submission ----
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successBanner.classList.remove('show');
 
    const validations = [
      validateFullName(),
      validateEmail(),
      validatePhone(),
      validateAge(),
      validatePassword(),
      validateConfirmPassword(),
      validateBio()
    ];
 
    const allValid = validations.every(Boolean);
 
    if (allValid) {
      successBanner.classList.add('show');
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // form.reset() and further submission logic (e.g. fetch to a server) goes here
    } else {
      // Focus the first invalid field for accessibility
      const firstInvalid = form.querySelector('.error');
      if (firstInvalid) firstInvalid.focus();
    }
  });
});