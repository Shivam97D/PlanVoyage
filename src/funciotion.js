
  // Attach to all relevant buttons
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const label = btn.innerText.trim() || btn.getAttribute("aria-label") || "Button clicked";
      Toastify({
        text: `You clicked: ${label} 
                This is under construction...`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#8A7FF0",
        stopOnFocus: true,
      }).showToast();
    });
  });


// Target date for countdown - May 25, 2025, 00:00:00
const tripStartDate = new Date('2025-05-25T00:00:00');



function updateCountdown() {
  const now = new Date();
  const diff = tripStartDate - now;

  if (diff <= 0) {
    // If the date has passed, show zeros or some message
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Helper function to pad numbers with leading zeros
  function pad(num) {
    return num.toString().padStart(2, '0');
  }

  // Update front and back spans inside flip cards
  ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
    const front = document.querySelector(`#${id}.flip-card-front span.block`) || document.getElementById(id);
    const back = document.querySelector(`#${id}.flip-card-back span.block`);

    // Update both front and back texts
    document.querySelectorAll(`#${id}`).forEach(el => el.textContent = pad(eval(id)));

    // Since you have duplicate numbers inside front and back, just update by IDs below instead:
  });

  // Directly update the front and back numbers by IDs inside both front and back cards
  // Front cards
  document.querySelectorAll('#days').forEach(el => el.textContent = pad(days));
  document.querySelectorAll('#hours').forEach(el => el.textContent = pad(hours));
  document.querySelectorAll('#minutes').forEach(el => el.textContent = pad(minutes));
  document.querySelectorAll('#seconds').forEach(el => el.textContent = pad(seconds));

  // Back cards
  // Assuming the back spans also have the same IDs? If not, you can add data attributes or classes to target them.
  // For simplicity, give back spans IDs like 'days-back', 'hours-back', etc., or target with class selectors.

  // Example if back spans have IDs:
  // document.getElementById('days-back').textContent = pad(days);
  // document.getElementById('hours-back').textContent = pad(hours);
  // document.getElementById('minutes-back').textContent = pad(minutes);
  // document.getElementById('seconds-back').textContent = pad(seconds);
}

// Initial call
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);
