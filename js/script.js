document.addEventListener('DOMContentLoaded', function () {
  function scrollToContact(event) {
    event.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Attach to buttons that previously used inline onclick
  document.querySelectorAll('.btn-nav').forEach(btn => btn.addEventListener('click', scrollToContact));
  document.querySelectorAll('.btn-contact').forEach(btn => btn.addEventListener('click', scrollToContact));

  // Subtle avatar parallax when cursor moves over the hero right area
  (function attachAvatarParallax(){
    const ring = document.querySelector('.avatar-ring');
    if (!ring) return;
    const container = ring.closest('.hero-right') || ring.parentElement;
    const maxOffset = 12; // px maximum translation

    function onMove(e){
      const rect = ring.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); // -1 .. 1
      const dy = (e.clientY - cy) / (rect.height / 2);
      const tx = Math.max(-maxOffset, Math.min(maxOffset, dx * maxOffset));
      const ty = Math.max(-maxOffset, Math.min(maxOffset, dy * maxOffset));
      ring.style.transform = `translate(${tx}px, ${ty}px)`;
    }

    function reset(){ ring.style.transform = 'translate(0, 0)'; }

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', reset);
    container.addEventListener('touchstart', reset, {passive:true});
  })();

  // SmartVend card slideshow (auto-loop)
  (function initSmartVendSlideshow(){
    const gallery = document.getElementById('smartvend-gallery');
    if (!gallery) return;
    const slides = Array.from(gallery.querySelectorAll('.slide'));
    if (!slides.length) return;

    let current = 0;
    const intervalMs = 3000; // 3s per slide
    let timer = null;

    function show(index){
      slides.forEach((s,i)=> s.classList.toggle('active', i === index));
      current = index;
    }

    function next(){
      show((current + 1) % slides.length);
    }

    // start loop when images are loaded or immediately
    function start(){
      if (timer) clearInterval(timer);
      timer = setInterval(next, intervalMs);
    }

    // start after window load to ensure images have dimensions
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, {once:true});

    // pause on hover (optional) and resume on leave to avoid motion while interacting
    gallery.addEventListener('mouseenter', ()=> { if (timer) clearInterval(timer); });
    gallery.addEventListener('mouseleave', ()=> start());
  })();

  // Contact form handling (client-side demo)
  (function attachContactForm(){
    const form = document.getElementById('contact-form');
    if (!form) return;
    const successEl = document.getElementById('contact-success');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.querySelector('#contact-name');
      const email = form.querySelector('#contact-email');
      const message = form.querySelector('#contact-message');

      // Basic validation
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()){
        // simple visual feedback
        [name,email,message].forEach(i=>{
          if(i && !i.value.trim()){
            i.style.borderColor = '#ff6b6b';
            setTimeout(()=>{ i.style.borderColor = ''; }, 1500);
          }
        });
        return;
      }

      // Demo behaviour: show success, clear form
      if (successEl){
        // build success content with icon
        successEl.innerHTML = '<span class="icon">✓</span><span>Message sent successfully</span>';
        successEl.hidden = false;
        // trigger animated show
        requestAnimationFrame(()=> successEl.classList.add('show'));
      }
      form.reset();

      // hide after a few seconds
      setTimeout(()=>{
        if (successEl){
          successEl.classList.remove('show');
          setTimeout(()=> successEl.hidden = true, 280);
        }
      }, 3800);
    });
  })();

  // Create a seamless looping effect for the tech carousel by duplicating track items
  (function initTechCarousel(){
    const track = document.querySelector('.tech-track');
    if (!track) return;

    // Duplicate children to allow a seamless loop (do this only once)
    const initialChildren = Array.from(track.children);
    if (initialChildren.length === 0) return;
    if (track.dataset.duplicated !== 'true'){
      initialChildren.forEach(node => track.appendChild(node.cloneNode(true)));
      track.dataset.duplicated = 'true';
    }

    const speed = 80; // px/s — adjust for faster/slower scrolling

    // Setup and start animation when layout and assets are ready
    function setupAnimation(){
      // Cancel previous animation if any
      if (track._techAnimation) track._techAnimation.cancel();

      // Measure widths after layout
      const fullWidth = Math.round(track.scrollWidth); // duplicated width
      const singleWidth = Math.round(fullWidth / 2); // original content width

      // Guard: if widths are zero or invalid, retry later
      if (!singleWidth || singleWidth <= 0) return;

      // Ensure track has explicit width to avoid flex reflow during animation
      track.style.width = fullWidth + 'px';

      const durationMs = Math.max(8000, Math.round((singleWidth / speed) * 1000));

      // Use Web Animations API for a smooth, pixel-perfect loop
      track._techAnimation = track.animate([
        { transform: 'translateX(0px)' },
        { transform: `translateX(-${singleWidth}px)` }
      ], {
        duration: durationMs,
        iterations: Infinity,
        easing: 'linear'
      });
    }

    // If page already loaded, run setup now; otherwise wait for load so images/fonts sizes are stable
    if (document.readyState === 'complete'){
      setupAnimation();
    } else {
      window.addEventListener('load', setupAnimation, {once:true});
    }

    // Recalculate on resize to avoid gaps or misalignment
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupAnimation, 150);
    });
  })();

});
