/* Learn Bharat School – interactions
   Libraries (loaded from CDN in each page): GSAP + ScrollTrigger, Swiper, GLightbox, Lucide.
   Every block checks that its library loaded, so the site still works if one fails. */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  const animate = hasGsap && !reduceMotion;

  // Hide reveal-targets only when we know we can animate them in.
  if (animate) document.documentElement.classList.add("anim");

  document.addEventListener("DOMContentLoaded", () => {
    // ---------- Icons ----------
    if (window.lucide) window.lucide.createIcons();

    // ---------- Header: scrolled state + mobile menu ----------
    const header = document.querySelector(".site-header");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav");
    if (toggle && nav) {
      const setOpen = (open) => {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        toggle.innerHTML = '<i data-lucide="' + (open ? "x" : "menu") + '"></i>';
        if (window.lucide) window.lucide.createIcons();
      };
      toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
      nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    }

    // Highlight "Contact" while its section is in view on the home page
    const contactSection = document.getElementById("contact");
    const contactLink = document.querySelector('.nav a[href$="#contact"]');
    if (contactSection && contactLink && "IntersectionObserver" in window) {
      const homeLink = document.querySelector('.nav a[data-page="home"]');
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            contactLink.classList.add("active");
            if (homeLink) homeLink.classList.remove("active");
          } else {
            contactLink.classList.remove("active");
            if (homeLink) homeLink.classList.add("active");
          }
        });
      }, { threshold: 0.35 }).observe(contactSection);
    }

    // ---------- Counters ----------
    const counters = document.querySelectorAll("[data-count]");
    const runCounter = (el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      if (!animate) { el.textContent = end + suffix; return; }
      const obj = { v: 0 };
      window.gsap.to(obj, {
        v: end, duration: 1.8, ease: "power2.out",
        onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
        onComplete: () => (el.textContent = end + suffix),
      });
    };
    if (hasST && animate) {
      counters.forEach((el) => window.ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => runCounter(el) }));
    } else {
      counters.forEach(runCounter);
    }

    // ---------- Scroll reveals ----------
    if (animate && hasST) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      // Groups: children of [data-reveal-group] come in one after another
      document.querySelectorAll("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll(":scope > [data-reveal]");
        window.gsap.fromTo(items, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });
      // Single elements
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (el.parentElement && el.parentElement.hasAttribute("data-reveal-group")) return;
        if (el.closest("[data-hero]")) return;
        window.gsap.fromTo(el, { y: 36, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Timeline line grows with scroll
      const tl = document.querySelector(".timeline");
      if (tl) {
        window.gsap.fromTo(tl, { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 70%", scrub: true } });
      }

      // Gentle parallax on the big bento photo
      document.querySelectorAll(".tile-photo img").forEach((img) => {
        window.gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } });
      });
    }

    // ---------- Hero sequence (home page only) ----------
    const hero = document.querySelector(".hero");
    if (hero && animate) {
      const g = window.gsap;
      const words = hero.querySelectorAll("h1 .w > span");
      const frame = hero.querySelector(".photo-frame");
      const tlHero = g.timeline({ defaults: { ease: "power3.out" } });
      tlHero
        .fromTo(frame, { clipPath: "inset(0 0 100% 0 round 28px)", scale: 1.04 }, { clipPath: "inset(0 0 0% 0 round 28px)", scale: 1, duration: 1.2, ease: "power3.inOut" }, 0)
        .fromTo(".hero .arcs", { opacity: 0, scale: 0.85, rotate: -30 }, { opacity: 0.9, scale: 1, rotate: 0, duration: 1.4 }, 0.2)
        .to(words, { y: 0, duration: 0.9, stagger: 0.06 }, 0.15)
        .to(hero.querySelectorAll("[data-hero]"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, startAt: { y: 20 } }, 0.55)
        .fromTo(".float-card", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.18 }, 1.0);
      g.to(".fc-1", { y: -8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
      g.to(".fc-2", { y: 8, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.3 });
      if (window.matchMedia("(hover: hover) and (min-width: 961px)").matches) {
        const qx = g.quickTo(frame, "x", { duration: 0.9, ease: "power3.out" });
        const qy = g.quickTo(frame, "y", { duration: 0.9, ease: "power3.out" });
        hero.addEventListener("pointermove", (e) => {
          qx((e.clientX / window.innerWidth - 0.5) * 12);
          qy((e.clientY / window.innerHeight - 0.5) * 8);
        });
      }
    }

    // ---------- Testimonials (Swiper) ----------
    const reviews = document.querySelector(".shorts.swiper");
    if (reviews && window.Swiper) {
      new window.Swiper(reviews, {
        slidesPerView: 1.4, spaceBetween: 18, grabCursor: true, loop: false,
        autoplay: reduceMotion ? false : { delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: { 560: { slidesPerView: 2.3 }, 860: { slidesPerView: 3.2 }, 1100: { slidesPerView: 4.2 } },
      });
    }

    // ---------- Gallery: lightbox + filters ----------
    if (window.GLightbox && document.querySelector(".glightbox")) {
      window.GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
    }
    const chips = document.querySelectorAll(".chip[data-filter]");
    const sections = document.querySelectorAll(".g-section");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => { c.classList.toggle("active", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
        const f = chip.dataset.filter;
        sections.forEach((s) => { s.hidden = !(f === "all" || s.dataset.cat === f); });
        const shown = Array.from(sections).filter((s) => !s.hidden);
        if (animate && shown.length) {
          window.gsap.fromTo(shown.map((s) => s.querySelectorAll(".g-item")).flatMap((n) => Array.from(n)).slice(0, 24),
            { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: "power3.out" });
        }
        if (f !== "all" && shown[0]) shown[0].scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // ---------- Optional admission session text (set in config.js) ----------
    const sessionTxt = (window.SCHOOL && window.SCHOOL.session) ? " for " + window.SCHOOL.session : "";
    document.querySelectorAll("[data-session]").forEach((el) => { el.textContent = sessionTxt; });

    // ---------- Confetti (used by the Fun Zone games) ----------
    const COLORS = ["#f0b13a", "#e2566b", "#1b78b8", "#18a058", "#8cc9f0"];
    const burst = (x, y, n) => {
      if (reduceMotion) return;
      n = n || 24;
      for (let i = 0; i < n; i++) {
        const el = document.createElement("span");
        el.className = "confetti";
        el.style.left = x + "px"; el.style.top = y + "px";
        el.style.background = COLORS[i % COLORS.length];
        if (i % 3 === 0) el.style.borderRadius = "50%";
        document.body.appendChild(el);
        const dx = (Math.random() - 0.5) * 340, up = 80 + Math.random() * 140, down = 120 + Math.random() * 160, rot = Math.random() * 720 - 360;
        el.animate([
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          { transform: "translate(" + dx * 0.6 + "px," + -up + "px) rotate(" + rot * 0.5 + "deg)", opacity: 1, offset: 0.4 },
          { transform: "translate(" + dx + "px," + down + "px) rotate(" + rot + "deg)", opacity: 0 }
        ], { duration: 1000 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => el.remove();
      }
    };

    // ---------- Fun Zone: memory match ----------
    const mem = document.getElementById("mem-grid");
    const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; };
    if (mem) {
      const faces = ["🐘", "🦁", "🍎", "🚌", "⭐", "🌈"];
      const $ = (id) => document.getElementById(id);
      let first = null, lock = false, moves = 0, found = 0, secs = 0, timer = null;
      const setMsg = (t) => ($("mem-msg").textContent = t);
      const start = () => {
        clearInterval(timer); timer = null; first = null; lock = false; moves = 0; found = 0; secs = 0;
        $("mem-moves").textContent = "0"; $("mem-time").textContent = "0";
        setMsg("Tap two cards to find a pair.");
        mem.innerHTML = "";
        shuffle(faces.concat(faces)).forEach((f, i) => {
          const b = document.createElement("button");
          b.type = "button"; b.className = "mem-card"; b.dataset.v = f;
          b.setAttribute("aria-label", "Card " + (i + 1) + ", face down");
          b.innerHTML = '<span class="mem-in"><span class="mem-face mem-front" aria-hidden="true">?</span><span class="mem-face mem-back" aria-hidden="true">' + f + "</span></span>";
          b.addEventListener("click", () => flip(b, i));
          mem.appendChild(b);
        });
      };
      const flip = (b, i) => {
        if (lock || b.classList.contains("flipped") || b.classList.contains("matched")) return;
        if (!timer) timer = setInterval(() => { secs++; $("mem-time").textContent = secs; }, 1000);
        b.classList.add("flipped");
        b.setAttribute("aria-label", "Card " + (i + 1) + ", " + b.dataset.v);
        if (!first) { first = b; return; }
        moves++; $("mem-moves").textContent = moves;
        if (first.dataset.v === b.dataset.v) {
          first.classList.add("matched"); b.classList.add("matched");
          found++; first = null;
          setMsg("A pair! " + (6 - found) + " to go.");
          if (found === 6) {
            clearInterval(timer);
            setMsg("You did it in " + moves + " moves and " + secs + " seconds! 🎉");
            const r = mem.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 60);
          }
        } else {
          lock = true;
          const a = first; first = null;
          setTimeout(() => {
            [a, b].forEach((c) => { c.classList.remove("flipped"); c.setAttribute("aria-label", "Card, face down"); });
            lock = false;
          }, 850);
        }
      };
      $("mem-reset").addEventListener("click", start);
      start();
    }

    // ---------- Fun Zone: letter cards (English / Hindi) ----------
    const flipGrid = document.getElementById("flip-grid");
    if (flipGrid) {
      const sets = {
        en: [["A", "Apple", "🍎"], ["B", "Ball", "⚽"], ["C", "Cat", "🐱"], ["D", "Dog", "🐶"], ["E", "Elephant", "🐘"], ["F", "Fish", "🐟"], ["G", "Grapes", "🍇"], ["H", "Hat", "🎩"]],
        hi: [["क", "कबूतर", "🕊️"], ["ख", "खरगोश", "🐰"], ["ग", "गाय", "🐄"], ["च", "चूहा", "🐭"], ["ट", "टमाटर", "🍅"], ["ब", "बतख", "🦆"], ["म", "मछली", "🐟"], ["ह", "हाथी", "🐘"]],
      };
      const render = (lang) => {
        flipGrid.innerHTML = "";
        sets[lang].forEach(([l, w, e]) => {
          const b = document.createElement("button");
          b.type = "button"; b.className = "flip"; b.setAttribute("aria-pressed", "false");
          b.setAttribute("aria-label", "Letter " + l + ". Tap to see the word");
          b.innerHTML = '<span class="mem-in"><span class="mem-face mem-front">' + l + '</span><span class="mem-face mem-back"><span aria-hidden="true">' + e + "</span><b>" + w + "</b></span></span>";
          b.addEventListener("click", () => {
            const on = b.classList.toggle("on");
            b.setAttribute("aria-pressed", String(on));
            b.setAttribute("aria-label", on ? l + " for " + w : "Letter " + l + ". Tap to see the word");
          });
          flipGrid.appendChild(b);
        });
        if (animate) window.gsap.from(flipGrid.children, { y: 30, opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.06, ease: "back.out(1.6)" });
      };
      document.querySelectorAll(".lang-switch .chip").forEach((c) => c.addEventListener("click", () => {
        document.querySelectorAll(".lang-switch .chip").forEach((x) => { x.classList.toggle("active", x === c); x.setAttribute("aria-pressed", String(x === c)); });
        render(c.dataset.lang);
      }));
      render("en");
    }

    // ---------- Fun Zone: quick maths ----------
    const mq = document.getElementById("math-q");
    if (mq) {
      let score = 0, streak = 0, answer = 0, busy = false;
      const opts = document.getElementById("math-opts"), msg = document.getElementById("math-msg"), dots = document.getElementById("math-dots");
      const rnd = (n) => 1 + Math.floor(Math.random() * n);
      const next = () => {
        busy = false;
        const a = rnd(5), b = rnd(5); answer = a + b;
        mq.textContent = a + " + " + b + " = ?";
        dots.textContent = "⭐".repeat(a) + "  +  " + "⭐".repeat(b);
        const set = new Set([answer]);
        while (set.size < 4) { const o = Math.max(1, answer + rnd(4) * (Math.random() < 0.5 ? -1 : 1)); set.add(o); }
        opts.innerHTML = "";
        shuffle(Array.from(set)).forEach((n) => {
          const btn = document.createElement("button");
          btn.type = "button"; btn.textContent = n;
          btn.addEventListener("click", () => {
            if (busy) return;
            if (n === answer) {
              busy = true; score++; streak++;
              document.getElementById("math-score").textContent = score;
              document.getElementById("math-streak").textContent = streak;
              msg.textContent = streak >= 3 ? "Amazing! " + streak + " in a row! 🌟" : "Great job! 🎉";
              const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, streak >= 3 ? 50 : 22);
              setTimeout(next, 1100);
            } else {
              streak = 0; document.getElementById("math-streak").textContent = 0;
              btn.classList.add("wrong"); btn.disabled = true;
              msg.textContent = "Not quite. Count the stars and try again!";
            }
          });
          opts.appendChild(btn);
        });
      };
      next();
    }

    // ---------- Shorts: play inside the page ----------
    const shortLinks = document.querySelectorAll("a.short[data-yt]");
    if (shortLinks.length) {
      const modal = document.createElement("div");
      modal.className = "yt-modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-label", "Video player");
      modal.innerHTML = '<div class="yt-box"><button class="yt-close" type="button" aria-label="Close video">&times;</button><div class="yt-frame"></div><p class="yt-title"></p><a class="yt-ext" target="_blank" rel="noopener">Open on YouTube</a></div>';
      document.body.appendChild(modal);
      const frame = modal.querySelector(".yt-frame"), ttl = modal.querySelector(".yt-title"), ext = modal.querySelector(".yt-ext"), closeBtn = modal.querySelector(".yt-close");
      let lastFocus = null;
      const close = () => {
        modal.classList.remove("open"); document.body.classList.remove("yt-open");
        frame.innerHTML = "";                       // removing the iframe stops the video
        if (lastFocus) lastFocus.focus();
      };
      const open = (a) => {
        lastFocus = a;
        const id = a.dataset.yt, title = a.dataset.title || "Video";
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="' + title + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
        ttl.textContent = title; ext.href = "https://www.youtube.com/shorts/" + id;
        modal.classList.add("open"); document.body.classList.add("yt-open");
        closeBtn.focus();
      };
      shortLinks.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(a); }));
      closeBtn.addEventListener("click", close);
      modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    }

    // ---------- WhatsApp links + chat widget ----------
    const S = window.SCHOOL || { whatsapp: "", email: "" };
    const waUrl = (text) => "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = waUrl(a.dataset.wa);
      a.target = "_blank";
      a.rel = "noopener";
    });

    const widget = document.querySelector(".wa-widget");
    if (widget) {
      const fab = widget.querySelector(".wa-fab");
      const panel = widget.querySelector(".wa-panel");
      const tip = widget.querySelector(".wa-tip");
      const setOpen = (open) => {
        widget.classList.toggle("open", open);
        fab.setAttribute("aria-expanded", String(open));
        panel.setAttribute("aria-hidden", String(!open));
        if (open) tip.classList.remove("show");
      };
      fab.addEventListener("click", () => setOpen(!widget.classList.contains("open")));
      widget.querySelector(".wa-close").addEventListener("click", () => { setOpen(false); fab.focus(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
      document.addEventListener("click", (e) => { if (!widget.contains(e.target)) setOpen(false); });
      // Gentle nudge once per visit
      try {
        if (!sessionStorage.getItem("wa-tip-seen")) {
          setTimeout(() => {
            if (!widget.classList.contains("open")) tip.classList.add("show");
            setTimeout(() => tip.classList.remove("show"), 6500);
            sessionStorage.setItem("wa-tip-seen", "1");
          }, 5000);
        }
      } catch (err) { /* storage blocked: skip the nudge */ }
    }

    // ---------- Admission enquiry form: send via WhatsApp or email ----------
    document.querySelectorAll("form[data-enquiry]").forEach((form) => {
      const note = form.querySelector(".form-note");
      const original = note ? note.textContent : "";
      const setNote = (msg, cls) => { if (note) { note.textContent = msg; note.className = "form-note" + (cls ? " " + cls : ""); } };

      form.addEventListener("input", (e) => { e.target.classList.remove("invalid"); setNote(original, ""); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const via = (e.submitter && e.submitter.dataset.via) || "whatsapp";
        const get = (n) => ((form.elements[n] && form.elements[n].value) || "").trim();

        let firstBad = null;
        form.querySelectorAll("[required]").forEach((f) => {
          let bad = !f.value.trim();
          if (f.type === "tel" && !bad) bad = f.value.replace(/\D/g, "").length < 10;
          f.classList.toggle("invalid", bad);
          if (bad && !firstBad) firstBad = f;
        });
        if (firstBad) {
          setNote(firstBad.type === "tel" ? "Enter a phone number with at least 10 digits." : "Please fill in the highlighted fields.", "err");
          firstBad.focus();
          return;
        }

        const lines = [
          "Hello " + (S.name || "school") + ", I would like to enquire about admission.",
          "",
          "Parent: " + get("name"),
          "Phone: " + get("phone"),
          "Child: " + get("child"),
          "Class: " + get("class"),
        ];
        if (get("message")) lines.push("", get("message"));
        const text = lines.join("\n");

        if (via === "email") {
          window.location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Admission enquiry for " + get("child")) + "&body=" + encodeURIComponent(text);
          setNote("Opening your email app.", "ok");
        } else {
          window.open(waUrl(text), "_blank", "noopener");
          setNote("Opening WhatsApp. Tap send there to deliver your message.", "ok");
        }
      });
    });
  });
})();
