document.addEventListener('DOMContentLoaded', function () {
  function scrollToContact(event) {
    event.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Attach to buttons that previously used inline onclick
  document.querySelectorAll('.btn-nav').forEach(btn => btn.addEventListener('click', scrollToContact));
  document.querySelectorAll('.btn-contact').forEach(btn => btn.addEventListener('click', scrollToContact));
});
