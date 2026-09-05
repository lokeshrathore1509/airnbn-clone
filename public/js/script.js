(() => {
  'use strict';

  // 1. Bootstrap Form Validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // 2. Interactive Tax Switch Toggle
  const taxSwitch = document.getElementById('switchCheckDefault');
  if (taxSwitch) {
    taxSwitch.addEventListener('change', () => {
      const taxBadges = document.querySelectorAll('.tax-badge');
      const basePrices = document.querySelectorAll('.base-price');

      taxBadges.forEach(badge => {
        badge.style.display = taxSwitch.checked ? 'inline-block' : 'none';
      });

      basePrices.forEach(el => {
        const raw = parseFloat(el.getAttribute('data-raw-price') || '0');
        if (taxSwitch.checked) {
          const withTax = Math.round(raw * 1.18);
          el.innerText = withTax.toLocaleString('en-IN');
        } else {
          el.innerText = raw.toLocaleString('en-IN');
        }
      });
    });
  }

  // 3. Wishlist Heart Button Interactive Toggle
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('liked');
      const icon = btn.querySelector('i');
      if (icon) {
        if (btn.classList.contains('liked')) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
      }
    }
  });

  // 4. Reserve Card Nights Calculation (Show Page)
  const checkIn = document.getElementById('reserve-checkin');
  const checkOut = document.getElementById('reserve-checkout');
  const guests = document.getElementById('reserve-guests');
  const nightsCount = document.getElementById('nights-count');
  const subtotalEl = document.getElementById('reserve-subtotal');
  const gstEl = document.getElementById('reserve-gst');
  const grandTotalEl = document.getElementById('reserve-grandtotal');

  function updateReserveTotal() {
    if (!checkIn || !checkOut || !subtotalEl) return;
    const pricePerNight = parseFloat(subtotalEl.getAttribute('data-price') || '0');
    
    const d1 = new Date(checkIn.value);
    const d2 = new Date(checkOut.value);
    let diffDays = 3; // Default 3 nights
    if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d2 > d1) {
      diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    }

    if (nightsCount) nightsCount.innerText = diffDays;
    const subtotal = diffDays * pricePerNight;
    const gst = Math.round(subtotal * 0.18);
    const cleaningFee = 500;
    const grandTotal = subtotal + gst + cleaningFee;

    subtotalEl.innerText = `₹${subtotal.toLocaleString('en-IN')}`;
    if (gstEl) gstEl.innerText = `₹${gst.toLocaleString('en-IN')}`;
    if (grandTotalEl) grandTotalEl.innerText = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  if (checkIn && checkOut) {
    checkIn.addEventListener('change', updateReserveTotal);
    checkOut.addEventListener('change', updateReserveTotal);
  }

})();