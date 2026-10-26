const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
  navLinks.dataset.open = String(open);
});
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }),
);
const form = document.querySelector("[data-inquiry]");
function connectBrief(title, collect) {
  if (!form) return;
  form
    .querySelectorAll('[type="submit"]')
    .forEach((button) => (button.disabled = false));
  const result = document.getElementById("brief-result"),
    area = document.getElementById("brief-text"),
    email = document.getElementById("email-brief"),
    status = document.getElementById("copy-status");
  const update = () => {
    email.href =
      "mailto:josephjilovec@pm.me?subject=" +
      encodeURIComponent(title) +
      "&body=" +
      encodeURIComponent(area.value);
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    area.value =
      title +
      "\n\n" +
      collect(new FormData(form)) +
      "\n\nI understand this service is in development. Please let me know whether a suitable pilot is available and agree the scope before any engagement.";
    update();
    result.hidden = false;
    document.getElementById("brief-heading").focus();
    status.textContent =
      "Draft created in this browser. Nothing has been sent.";
  });
  area.addEventListener("input", update);
  document.getElementById("copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent =
        "Copied. Paste the draft into your preferred email app.";
    } catch {
      area.focus();
      area.select();
      status.textContent =
        "Select and copy the draft above using your device’s copy command.";
    }
  });
  form.addEventListener("input", (e) => {
    if (e.target.closest("#brief-result")) return;
    result.hidden = true;
    status.textContent = "";
  });
}
function observeChapters(selector, onChange) {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) onChange(active.target.dataset.chapter);
    },
    { rootMargin: "-18% 0px -36% 0px", threshold: [0, 0.25, 0.5] },
  );
  document.querySelectorAll(selector).forEach((e) => observer.observe(e));
}
const comparisonButtons = document.querySelectorAll("[data-comparison]");
comparisonButtons.forEach((b) =>
  b.addEventListener("click", () => {
    const daily = b.dataset.comparison === "daily";
    comparisonButtons.forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
    document.getElementById("period-a-bar").style.width = daily
      ? "80%"
      : "68.5714%";
    document.getElementById("period-b-bar").style.width = "90%";
    document.getElementById("period-a-value").textContent = daily
      ? "800 US gal/day"
      : "24,000 US gal";
    document.getElementById("period-b-value").textContent = daily
      ? "900 US gal/day"
      : "31,500 US gal";
    document.getElementById("change-amount").textContent = daily
      ? "+12.5%"
      : "+31.3%";
    document.getElementById("comparison-summary").textContent = daily
      ? "Higher daily consumption after accounting for billing duration."
      : "Higher billed total, before accounting for the five extra days.";
  }),
);
const contextNotes = {
  unknown: [
    "Ask the property team about occupancy, irrigation schedules and known work before assigning a cause.",
    "Review occupancy, irrigation schedules and known work.",
  ],
  occupancy: [
    "Verify when occupancy changed and whether the timing aligns with the billing periods. Do not assume this accounts for the entire increase.",
    "Verify occupancy dates and compare them with the bill periods.",
  ],
  irrigation: [
    "Check the irrigation schedule, weather context and any known work. Ask a qualified specialist to investigate unresolved site questions.",
    "Review irrigation schedules and known work with the property team.",
  ],
};
document.querySelectorAll("[data-context]").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll("[data-context]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const note = contextNotes[b.dataset.context];
    document.getElementById("context-question").textContent = note[0];
    document.getElementById("followup-question").textContent = note[1];
  }),
);
observeChapters(".report-part", (id) => {
  document.querySelectorAll("[data-review-link]").forEach((a) => {
    if (a.dataset.reviewLink === id) a.setAttribute("aria-current", "step");
    else a.removeAttribute("aria-current");
  });
});
document.querySelectorAll("[name=records]").forEach((c) =>
  c.addEventListener("change", () => {
    const count = document.querySelectorAll("[name=records]:checked").length;
    document.getElementById("readiness-count").textContent = count + " / 4";
    document.getElementById("readiness-note").textContent =
      count === 4
        ? "The basics are identified. A first conversation can check permissions, record quality and proposed scope."
        : count
          ? "Keep the gaps visible. A first conversation can clarify what is missing before a pilot is scoped."
          : "Start by identifying one property and the records you can access with permission.";
  }),
);
connectBrief(
  "TechWater — data-readiness conversation",
  (d) =>
    "Reporting question: " +
    d.get("goal") +
    "\nAvailable records and ownership: " +
    (d.getAll("records").join(", ") || "Not yet confirmed") +
    "\nGeneral property context: " +
    (d.get("context") || "To discuss") +
    "\n\nPlease help identify missing information and whether a bill-based reporting pilot is suitable.",
);
