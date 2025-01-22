// Validasi email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validasi password
  // Password harus:
  // - Minimal 8 karakter
  // - Mengandung setidaknya 1 huruf kapital
  // - Mengandung setidaknya 1 huruf kecil
  // - Mengandung setidaknya 1 angka
  // - Tidak boleh mengandung karakter khusus
  export function   validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  }
  
  // Validasi string kosong
  export function   validateNonEmptyString(str) {
    return str && typeof str === 'string' && str.trim().length > 0;
  }
  