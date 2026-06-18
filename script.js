// Custom cursor
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
      cursor.style.top = my - 6 + 'px';
      });

      function animTrail() {
        tx += (mx - tx) * 0.12;
          ty += (my - ty) * 0.12;
            trail.style.left = tx - 18 + 'px';
              trail.style.top = ty - 18 + 'px';
                requestAnimationFrame(animTrail);
                }
                animTrail();

                document.querySelectorAll('a, button, .feature-card, input').forEach(el => {
                  el.addEventListener('mouseenter', () => {
                      cursor.style.transform = 'scale(2.5)';
                          trail.style.transform = 'scale(1.4)';
                            });
                              el.addEventListener('mouseleave', () => {
                                  cursor.style.transform = 'scale(1)';
                                      trail.style.transform = 'scale(1)';
                                        });
                                        });

                                        // Counter animation
                                        function animateCounter(el, target, duration = 1800) {
                                          let start = 0;
                                            const step = timestamp => {
                                                if (!start) start = timestamp;
                                                    const progress = Math.min((timestamp - start) / duration, 1);
                                                        const ease = 1 - Math.pow(1 - progress, 3);
                                                            el.textContent = Math.floor(ease * target).toLocaleString();
                                                                if (progress < 1) requestAnimationFrame(step);
                                                                  };
                                                                    requestAnimationFrame(step);
                                                                    }

                                                                    // Scroll reveal
                                                                    const io = new IntersectionObserver((entries) => {
                                                                      entries.forEach(e => {
                                                                          if (e.isIntersecting) {
                                                                                e.target.classList.add('visible');
                                                                                      e.target.querySelectorAll('.counter').forEach(c => {
                                                                                              animateCounter(c, parseInt(c.dataset.target));
                                                                                                    });
                                                                                                        }
                                                                                                          });
                                                                                                          }, { threshold: 0.15 });

                                                                                                          document.querySelectorAll('.reveal, .stats-bar').forEach(el => io.observe(el));

                                                                                                          // Tilt effect
                                                                                                          document.querySelectorAll('.tilt-card').forEach(card => {
                                                                                                            card.addEventListener('mousemove', e => {
                                                                                                                const r = card.getBoundingClientRect();
                                                                                                                    const x = (e.clientX - r.left) / r.width - 0.5;
                                                                                                                        const y = (e.clientY - r.top) / r.height - 0.5;
                                                                                                                            card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
                                                                                                                              });
                                                                                                                                card.addEventListener('mouseleave', () => {
                                                                                                                                    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
                                                                                                                                      });
                                                                                                                                      });

                                                                                                                                      // --- JOIN MODAL LOGIC ---
                                                                                                                                      const joinModal = document.getElementById('join-modal');
                                                                                                                                      const closeModal = document.querySelector('.close-modal');
                                                                                                                                      const saveBtn = document.getElementById('save-identity-btn');
                                                                                                                                      const nameInput = document.getElementById('anon-name-input');
                                                                                                                                      const joinButtons = document.querySelectorAll('.nav-cta, #hero .btn-primary');
                                                                                                                                      const whisperBtn = document.querySelector('#whisper .btn-primary');

                                                                                                                                      function openModal(e) {
                                                                                                                                        e.preventDefault();
                                                                                                                                          joinModal.classList.add('show');
                                                                                                                                          }

                                                                                                                                          joinButtons.forEach(btn => btn.addEventListener('click', openModal));
                                                                                                                                          closeModal.addEventListener('click', () => joinModal.classList.remove('show'));

                                                                                                                                          saveBtn.addEventListener('click', () => {
                                                                                                                                            const chosenName = nameInput.value.trim();
                                                                                                                                              if (chosenName.length < 3) {
                                                                                                                                                  alert("Name must be at least 3 characters long!");
                                                                                                                                                      return;
                                                                                                                                                        }
                                                                                                                                                          localStorage.setItem('campus_identity', chosenName);
                                                                                                                                                            updateUIForJoinedUser(chosenName);
                                                                                                                                                              joinModal.classList.remove('show');
                                                                                                                                                              });

                                                                                                                                                              function updateUIForJoinedUser(name) {
                                                                                                                                                                const navCta = document.querySelector('.nav-cta');
                                                                                                                                                                  if(navCta) {
                                                                                                                                                                      navCta.innerText = name;
                                                                                                                                                                          navCta.style.background = 'rgba(200,255,62,0.1)';
                                                                                                                                                                              navCta.style.color = 'var(--accent)';
                                                                                                                                                                                  navCta.style.border = '1px solid var(--accent)';
                                                                                                                                                                                    }
                                                                                                                                                                                      if(whisperBtn) {
                                                                                                                                                                                          whisperBtn.innerText = `Enter as ${name} →`;
                                                                                                                                                                                              whisperBtn.href = "#"; 
                                                                                                                                                                                                }
                                                                                                                                                                                                }

                                                                                                                                                                                                window.onload = () => {
                                                                                                                                                                                                  const savedName = localStorage.getItem('campus_identity');
                                                                                                                                                                                                    if(savedName) updateUIForJoinedUser(savedName);
                                                                                                                                                                                                    };
                                                                                                                                                                                                    