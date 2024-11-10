document.addEventListener('DOMContentLoaded', function() {
  // Validación de DNI
  const dniInputs = document.querySelectorAll('input[name="dni"]');
  dniInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '').slice(0, 8);
      if (this.value.length !== 8) {
        this.classList.add('is-invalid');
        this.setCustomValidity('El DNI debe tener 8 dígitos');
      } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        this.setCustomValidity('');
      }
    });
  });

  // Validación de teléfono
  const phoneInputs = document.querySelectorAll('input[name="telefono"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      
      // Formato: XXX-XXXXXXX
      if (value.length >= 3) {
        this.value = value.slice(0,3) + '-' + value.slice(3);
      } else {
        this.value = value;
      }
      
      // Validación para formato XXX-XXXXXXX
      const phonePattern = /^\d{3}-\d{7}$/;
      if (!phonePattern.test(this.value)) {
        this.classList.add('is-invalid');
        this.setCustomValidity('El teléfono debe tener el formato: XXX-XXXXXXX');
      } else {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        this.setCustomValidity('');
      }
    });
  });
}); 