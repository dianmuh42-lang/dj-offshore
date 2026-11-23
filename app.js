const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const track = (event, detail = {}) =>
  (window.dataLayer = window.dataLayer || []).push({ event, ...detail });
const menu = $("#nav"),
  burger = $("#burger");
function toggleMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.onclick = () => toggleMenu(!menu.classList.contains("open"));
menu.onclick = () => toggleMenu(false);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleMenu(false);
});
document
  .querySelectorAll('a[href="#contact"],a[href="#work"]')
  .forEach((a) =>
    a.addEventListener("click", () =>
      track("cta_click", { destination: a.hash, label: a.textContent.trim() }),
    ),
  );
const viewer = $("#viewer"),
  photo = $("#fullPhoto"),
  holder = $("#videoHolder");
document.querySelectorAll(".gallery button.card").forEach(
  (card) =>
    (card.onclick = () => {
      const img = card.querySelector("img"),
        id = card.dataset.video;
      const title = card.querySelector("strong").textContent;
      photo.hidden = Boolean(card.dataset.mp4);
      photo.src = img.src;
      photo.alt = img.alt;
      if (card.dataset.mp4) {
        const v = document.createElement("video");
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        v.poster = img.src;
        v.src = card.dataset.mp4;
        holder.append(v);
        watchSound(v);
      }
      $("#projectTitle").textContent = title;
      $("#category").textContent = card.querySelector("small").textContent;
      $("#source").hidden = Boolean(card.dataset.mp4);
      $("#source").href = id
        ? "https://www.youtube.com/watch?v=" + id
        : "https://offshorecreative.co/";
      $("#source").textContent = id ? "Watch on YouTube" : "Offshore portfolio";
      viewer.showModal();
      track("portfolio_open", { project: title });
    }),
);

const soundButton = viewer.querySelector(".sound");
function syncSound(video) {
  soundButton.textContent = video.muted ? "Sound on" : "Mute";
  soundButton.setAttribute(
    "aria-label",
    video.muted ? "Turn sound on" : "Mute sound",
  );
}
function watchSound(video) {
  soundButton.hidden = false;
  syncSound(video);
  video.addEventListener("volumechange", () => syncSound(video));
}
soundButton.onclick = (event) => {
  event.stopPropagation();
  const video = holder.querySelector("video");
  if (!video) return;
  video.muted = !video.muted;
  if (!video.muted && video.paused) video.play().catch(() => {});
  syncSound(video);
};
viewer.querySelector(".close").onclick = (event) => {
  event.stopPropagation();
  viewer.close();
};
viewer.onclick = (event) => {
  if (event.target !== viewer) return;
  const bounds = viewer.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    viewer.close();
};
viewer.onclose = () => {
  holder.replaceChildren();
  soundButton.hidden = true;
};
function revealGallery() {
  const active = document.getElementById(location.hash.slice(1));
  if (!active?.classList.contains("photoPanel")) return;
  document
    .querySelectorAll(".photoPanel")
    .forEach((panel) => (panel.hidden = panel !== active));
  active.focus({ preventScroll: true });
  active.scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
    block: "start",
  });
}
document.querySelectorAll(".photoCard").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    revealGallery();
  }),
);
window.addEventListener("hashchange", revealGallery);
revealGallery();
const form = $("#inquiry");
function inquiryMessage(data) {
  const services = data.getAll("service").join(", ");
  const rows = [
    ["Name", data.get("name")],
    ["Company / Property", data.get("company")],
    ["Property Location", data.get("location")],
    ["Instagram / Website", data.get("profile")],
    ["Property Type", data.get("type")],
    ["Services", services],
    ["Preferred Date", data.get("date")],
    ["Project Details", data.get("details")],
  ];
  return [
    "Hi Offshore Creative! 👋",
    "I'm interested in your creative services for my property.",
    ...rows
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => "*" + k + ":* " + v.trim()),
    "I'd love to discuss how we can work together to market my property. Looking forward to hearing from you!",
  ].join("\n\n");
}
form.elements.name.oninput = () => form.elements.name.setCustomValidity("");
form.onsubmit = (e) => {
  e.preventDefault();
  if (!form.elements.name.value.trim()) {
    form.elements.name.setCustomValidity("Please enter your name.");
    form.reportValidity();
    return;
  }
  const message = inquiryMessage(new FormData(form));
  window.open(
    "https://wa.me/628113935959?text=" + encodeURIComponent(message),
    "_blank",
    "noopener,noreferrer",
  );
  track("whatsapp_inquiry_open");
};
if (!reduced && window.gsap) {
  const io = new IntersectionObserver((entries) =>
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e) => {
        gsap.from(e.target, { y: 16, opacity: 0.75, duration: 0.55 });
        io.unobserve(e.target);
      }),
  );
  document
    .querySelectorAll(".gallery,.formats,.rows,.whyGrid aside")
    .forEach((el) => io.observe(el));
}
$("#heroWork").onclick = () =>
  document.querySelector('.gallery [data-video="Vl9wvu12mqE"]').click();

const formatsObserver = new IntersectionObserver((entries) => {
  for (const { isIntersecting, target } of entries) {
    if (!isIntersecting) {
      target.pause();
      continue;
    }
    if (!target.src) target.src = target.dataset.src;
    if (!reduced) target.play().catch(() => {});
  }
});
document
  .querySelectorAll(".formats video")
  .forEach((video) => formatsObserver.observe(video));
if (location.hash === "#work-")
  document.getElementById("work").scrollIntoView();
