// =========================================================
// WEDDING INVITATION — INTERACTIONS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const openInvitationBtn = document.getElementById("openInvitation");
  const royalCover = document.getElementById("royalCover");
  const siteShell = document.getElementById("siteShell");

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener("click", async () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      requestAnimationFrame(() => {
        document.body.classList.add("invitation-open");
        document.body.classList.remove("cover-mode");
      });

      if (royalCover) royalCover.setAttribute("aria-hidden", "true");

      const audio = document.getElementById("weddingAudio");
      if (audio) {
        audio.muted = false;
        try {
          await audio.play();
          const musicToggle = document.getElementById("musicToggle");
          const musicText = document.getElementById("musicText");
          if (musicToggle) musicToggle.classList.add("playing");
          if (musicText) musicText.textContent = "Pause";
        } catch (error) {
          console.log("Music could not start on seal click:", error);
        }
      }
    });
  }

  // ---------- Navbar ----------
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.textContent = navLinks.classList.contains("open") ? "×" : "☰";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.textContent = "☰";
    });
  });

  // ---------- Scroll reveal ----------
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach(item => observer.observe(item));

  // ---------- Countdown ----------
  // Change this date/time to your wedding date.
  // Format: YYYY-MM-DDTHH:MM:SS
  const weddingDate = new Date("2026-11-29T07:35:00");

  const countdown = () => {
    const now = new Date();
    const difference = weddingDate - now;

    if (difference <= 0) {
      setValue("days", "00");
      setValue("hours", "00");
      setValue("minutes", "00");
      setValue("seconds", "00");
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setValue("days", days);
    setValue("hours", hours);
    setValue("minutes", minutes);
    setValue("seconds", seconds);
  };

  const setValue = (id, value) => {
    document.getElementById(id).textContent =
      String(value).padStart(2, "0");
  };

  countdown();
  setInterval(countdown, 1000);

  // ---------- Background music ----------
  const audio = document.getElementById("weddingAudio");
  const musicToggle = document.getElementById("musicToggle");
  const musicText = document.getElementById("musicText");

  const setMusicButtonState = (isPlaying) => {
    if (!musicToggle || !musicText) return;
    musicToggle.classList.toggle("playing", isPlaying);
    musicText.textContent = isPlaying ? "Pause" : "Play";
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
  };

  const toggleMusic = async () => {
    if (!audio || !musicToggle) return;

    try {
      if (audio.paused) {
        audio.muted = false;
        await audio.play();
        setMusicButtonState(true);
      } else {
        audio.pause();
        audio.muted = true;
        setMusicButtonState(false);
      }
    } catch (error) {
      console.log("Music toggle failed:", error);
    }
  };

  if (musicToggle) {
    setMusicButtonState(false);
    musicToggle.addEventListener("click", toggleMusic);
  }

  // ---------- Subtle cursor glow on desktop ----------
  if (window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const style = document.createElement("style");
    style.textContent = `
      .cursor-glow {
        position: fixed;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
        background: radial-gradient(circle, rgba(142,216,242,.12), transparent 68%);
        transform: translate(-50%, -50%);
        transition: opacity .3s;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener("mousemove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    });
  }

  // ---------- Story card reveal on touch/click ----------
  const storyCards = document.querySelectorAll(".story-card-toggle");

  storyCards.forEach(card => {
    const toggleStoryCard = () => {
      const isAlreadyOpen = card.classList.contains("is-open");

      if (isAlreadyOpen) {
        card.classList.remove("is-open");
        return;
      }

      storyCards.forEach(other => {
        if (other === card) {
          other.classList.add("is-open");
        }
      });
    };

    card.addEventListener("click", event => {
      event.preventDefault();
      toggleStoryCard();
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleStoryCard();
      }
    });
  });

  // ---------- Soft tilt on cards ----------
  document.querySelectorAll(".story-card, .event-card").forEach(card => {
    if (card.classList.contains("story-card-toggle")) {
      return;
    }

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-7px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});
