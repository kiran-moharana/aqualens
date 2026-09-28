(function () {
  "use strict";
  function checkPlace(waterway, landmark) {
    function checkPart(raw) {
      const value = String(raw || "")
          .trim()
          .replace(/\s+/g, " "),
        chars = Array.from(value),
        letters = (value.match(/\p{L}/gu) || []).length;
      if (!value) return "empty";
      if (chars.length < 3 || letters < 3) return "short";
      if (
        PLACE_SPAM.test(value) ||
        KEYBOARD_RUN.test(value) ||
        /(.)\1{3,}/iu.test(value) ||
        letters / chars.length < 0.45
      )
        return "junk";
      return "";
    }
    const waterIssue = checkPart(waterway),
      landmarkIssue = checkPart(landmark);
    if (waterIssue === "empty" || landmarkIssue === "empty")
      return {
        ok: false,
        quiet: true,
        message:
          "Enter both the waterway and a nearby landmark. Obvious junk is blocked; names are not checked against a map.",
      };
    if (waterIssue === "short" || landmarkIssue === "short")
      return { ok: false, message: "Each field needs at least three letters." };
    if (waterIssue === "junk" || landmarkIssue === "junk")
      return {
        ok: false,
        message:
          "One of those looks like a test or random entry. Use the real names from your field spot.",
      };
    if (
      String(waterway).trim().toLocaleLowerCase() ===
      String(landmark).trim().toLocaleLowerCase()
    )
      return {
        ok: false,
        message:
          "Use two different details: the waterway name and a nearby landmark.",
      };
    return {
      ok: true,
      unverified: true,
      message:
        "These details look usable. Confirm the place to continue; this checks input quality, not the map.",
    };
  }
  const formatFieldDate = () =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
  function refreshFieldDate() {
    const el = $("#fieldDate");
    if (el) el.textContent = formatFieldDate();
  }
  refreshFieldDate();
  setInterval(refreshFieldDate, 60000);
  let state = {
    i: 0,
    a: {},
    flags: [],
    resolved: [],
    confidence: 90,
    flag: null,
    recheck: false,
    placeConfirmed: false,
    sample: false,
  };
  function show(id) {
    ["landingView", "assessmentView", "reportView"].forEach(
      (x) => ($("#" + x).hidden = x !== id),
    );
    window.scrollTo(0, 0);
  }
  function start() {
    state = {
      i: 0,
      a: {},
      flags: [],
      resolved: [],
      confidence: 90,
      flag: null,
      recheck: false,
      placeConfirmed: false,
      sample: false,
    };
    show("assessmentView");
    renderProgress();
    renderQuestion();
  }
  function sampleReport() {
    state = {
      i: 6,
      a: {
        waterway: "Sample stream",
        landmark: "Riverside footbridge",
        location: "Sample stream — near Riverside footbridge",
        clarity: "clear",
        smell: "earthy",
        surface: "litter",
        wildlife: "birds",
        rain: "heavy",
        outlet: "yes",
      },
      flags: [],
      resolved: [
        {
          title: "Clear water so soon after heavy rain is worth confirming.",
          decision: "Rechecked",
        },
      ],
      confidence: 86,
      flag: null,
      recheck: false,
      placeConfirmed: true,
      sample: true,
    };
    finish();
  }
  function renderProgress() {
    $("#progressList").innerHTML = QUESTIONS.map(
      (q, i) =>
        `<li class="${i === state.i ? "active" : ""} ${i < state.i || state.a[q.id] !== undefined ? "done" : ""}"><span class="step-dot">${i < state.i || state.a[q.id] !== undefined ? "✓" : i + 1}</span><span>${q.label}</span></li>`,
    ).join("");
  }
  function renderQuestion() {
    const q = QUESTIONS[state.i],
      val = state.a[q.id];
    state.flag = null;
    $("#stepCount").textContent =
      String(state.i + 1).padStart(2, "0") + " / 07";
    $("#locationEcho").textContent =
      state.a.location && state.i > 0 ? state.a.location : "New observation";
    $("#lensNote").textContent = NOTES[state.i];
    let body = `<p class="kicker">${q.kicker}</p><h2>${q.q}</h2><p class="hint">${q.hint}</p>`;
    if (q.type === "text")
      body += `<div class="text-answer"><div class="place-fields"><div class="place-field"><label for="waterwayInput">Waterway name</label><input id="waterwayInput" maxlength="50" autocomplete="off" autocapitalize="words" aria-describedby="placeCheck" placeholder="e.g. Budhabalanga River" value="${esc(state.a.waterway || "")}"></div><div class="place-field"><label for="landmarkInput">Nearby landmark</label><input id="landmarkInput" maxlength="50" autocomplete="off" autocapitalize="words" aria-describedby="placeCheck" placeholder="e.g. old bridge" value="${esc(state.a.landmark || "")}"></div></div><p class="place-check" id="placeCheck" role="status" aria-live="polite">Enter both the waterway and a nearby landmark. Obvious junk is blocked; names are not checked against a map.</p></div>`;
    else
      body += `<div class="options">${q.options.map((o) => `<button class="option ${val === o[0] ? "selected" : ""}" data-value="${o[0]}"><span class="marker"></span><span><b>${o[1]}</b><small>${o[2]}</small></span></button>`).join("")}</div>`;
    $("#questionWrap").innerHTML = body;
    $("#backBtn").disabled = state.i === 0 || state.recheck;
    $("#nextBtn").hidden = false;
    $("#nextBtn").disabled =
      q.type === "text"
        ? !checkPlace(state.a.waterway, state.a.landmark).ok
        : !val;
    $("#nextBtn").textContent =
      q.type === "text"
        ? "Confirm place →"
        : state.recheck
          ? "Return to cross-check →"
          : state.i === QUESTIONS.length - 1
            ? "Cross-check answers →"
            : "Continue →";
    if (q.type === "text") {
      const waterway = $("#waterwayInput"),
        landmark = $("#landmarkInput"),
        check = $("#placeCheck"),
        inputs = [waterway, landmark];
      function updatePlace(showError) {
        state.a.waterway = waterway.value.trim().replace(/\s+/g, " ");
        state.a.landmark = landmark.value.trim().replace(/\s+/g, " ");
        state.a.location =
          state.a.waterway && state.a.landmark
            ? state.a.waterway + " — near " + state.a.landmark
            : "";
        state.placeConfirmed = false;
        const result = checkPlace(state.a.waterway, state.a.landmark);
        $("#nextBtn").disabled = !result.ok;
        inputs.forEach((inp) =>
          inp.setAttribute(
            "aria-invalid",
            showError && !result.ok ? "true" : "false",
          ),
        );
        check.className =
          "place-check " +
          (result.ok ? "review" : showError && !result.quiet ? "error" : "");
        check.textContent = result.message;
      }
      setTimeout(() => waterway.focus(), 60);
      updatePlace(false);
      inputs.forEach((inp) => {
        inp.addEventListener("input", () => updatePlace(false));
        inp.addEventListener("blur", () => updatePlace(true));
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            updatePlace(true);
            if (checkPlace(state.a.waterway, state.a.landmark).ok) next();
          }
        });
      });
    } else
      document.querySelectorAll(".option").forEach((b) =>
        b.addEventListener("click", () => {
          state.a[q.id] = b.dataset.value;
          document
            .querySelectorAll(".option")
            .forEach((x) => x.classList.toggle("selected", x === b));
          $("#nextBtn").disabled = false;
          renderProgress();
        }),
      );
    renderProgress();
  }
  function collectFlags() {
    const a = state.a,
      rules = [
        {
          when: a.clarity === "clear" && a.smell === "rotten",
          title: "Clear water and a rotten smell rarely travel together.",
          text: "A rotten-egg smell comes from oxygen-poor decay, which often also clouds the water. One observation may still be right—this is simply worth a second look.",
          field: "clarity",
        },
        {
          when:
            a.clarity === "clear" &&
            ["foam", "oily", "algae"].includes(a.surface),
          title: "The surface and clarity are telling different stories.",
          text: "Foam, oil and thick algae all change how light passes into water. “Slightly cloudy” may be the closer match, but the final call is yours.",
          field: "clarity",
        },
        {
          when:
            a.surface === "clean" && ["rotten", "chemical"].includes(a.smell),
          title: "A strong smell deserves one more surface scan.",
          text: "Pollution can gather at the edges or near an inlet even when the middle looks clean. Take a slow look before keeping the answer.",
          field: "surface",
        },
        {
          when: a.wildlife === "fish" && a.smell === "rotten",
          title:
            "Swimming fish and an oxygen-poor smell pull in opposite directions.",
          text: "Fish may move through a stressed patch, but a sulfur-like smell can signal low oxygen. Watch once more: were the fish swimming normally, or only surfacing for air?",
          field: "wildlife",
        },
        {
          when:
            ["frogs", "insects"].includes(a.wildlife) &&
            (a.smell === "chemical" || a.surface === "oily"),
          title:
            "Sensitive wildlife appears beside a possible chemical signal.",
          text: "Frogs and aquatic insects can be sensitive to pollutants. Both observations can be real, but make sure the animals were at this stretch and the sheen or odor came from the water.",
          field: "wildlife",
        },
        {
          when:
            a.wildlife === "none" &&
            a.clarity === "clear" &&
            a.smell === "none" &&
            a.surface === "clean",
          title:
            "The water looks healthy, but the stream seems unusually quiet.",
          text: "A brief scan can miss wildlife. Pause for ten quiet seconds and check the shaded edge before recording that no life was spotted.",
          field: "wildlife",
        },
        {
          when: a.rain === "heavy" && a.clarity === "clear",
          title: "Clear water so soon after heavy rain is worth confirming.",
          text: "Urban runoff often carries sediment after a downpour, though spring-fed or protected streams may stay clear. Check that the rain was within the last two days.",
          field: "rain",
        },
        {
          when: a.rain === "heavy" && a.surface === "algae",
          title: "A thick algae mat after heavy rain is an unusual pairing.",
          text: "Dense mats usually build during calmer conditions, while strong runoff can break them apart. Recheck that the green cover is a fixed mat rather than floating leaves or duckweed.",
          field: "surface",
        },
      ];
    return rules
      .filter((rule) => rule.when)
      .map(({ title, text, field }) => ({ title, text, field }));
  }
  function next() {
    const current = QUESTIONS[state.i];
    if (
      current.id === "location" &&
      !checkPlace(state.a.waterway, state.a.landmark).ok
    ) {
      const inputs = [$("#waterwayInput"), $("#landmarkInput")],
        check = $("#placeCheck"),
        result = checkPlace(state.a.waterway, state.a.landmark);
      inputs.forEach((inp) => {
        if (inp) inp.setAttribute("aria-invalid", "true");
      });
      if (check) {
        check.className = "place-check error";
        check.textContent = result.message;
      }
      return;
    }
    if (!state.a[current.id]) return;
    if (current.id === "location") state.placeConfirmed = true;
    if (state.recheck) {
      state.recheck = false;
      state.flag++;
      if (state.flag < state.flags.length) renderFlag();
      else finish();
      return;
    }
    if (state.i < QUESTIONS.length - 1) {
      state.i++;
      renderQuestion();
      return;
    }
    state.flags = collectFlags();
    state.flag = 0;
    if (state.flags.length) renderFlag();
    else finish();
  }
  function renderFlag() {
    const f = state.flags[state.flag];
    $("#stepCount").textContent = "CROSS-CHECK";
    $("#locationEcho").textContent = state.a.location;
    $("#lensNote").textContent =
      "A flag is a request to look again—not a verdict.";
    $("#questionWrap").innerHTML =
      `<div class="flag-sheet"><p class="flag-mark">Lens raises an eyebrow.</p><h2>${f.title}</h2><p>${f.text}</p><div class="flag-actions"><button class="outline" id="keepFlag">Keep my observation</button><button class="primary" id="changeFlag">Let me recheck</button></div></div>`;
    $("#backBtn").disabled = true;
    $("#nextBtn").hidden = true;
    $("#keepFlag").addEventListener("click", () => {
      state.resolved.push({ title: f.title, decision: "Kept by observer" });
      state.confidence -= 10;
      advanceFlag();
    });
    $("#changeFlag").addEventListener("click", () => {
      state.resolved.push({ title: f.title, decision: "Rechecked" });
      state.confidence -= 4;
      state.i = QUESTIONS.findIndex((q) => q.id === f.field);
      state.recheck = true;
      renderQuestion();
    });
  }
  function advanceFlag() {
    state.flag++;
    if (state.flag < state.flags.length) renderFlag();
    else finish();
  }
  function compute() {
    const rows = [];
    Object.keys(DED).forEach((k) => {
      let v = state.a[k],
        pts = DED[k][v] || 0;
      if (k === "clarity" && v === "murky" && state.a.rain === "heavy")
        pts = Math.round(pts / 2);
      if (pts !== 0)
        rows.push({
          label: LABELS[v] || v,
          pts,
          why:
            (WHY[v] || "") +
            (k === "clarity" && v === "murky" && state.a.rain === "heavy"
              ? " Deduction halved because recent heavy rain explains part of the silt."
              : ""),
        });
    });
    const score = Math.max(
      5,
      Math.min(100, 100 - rows.reduce((s, r) => s + r.pts, 0)),
    );
    let key = "healthy";
    if (
      state.a.smell === "chemical" ||
      ["foam", "oily"].includes(state.a.surface)
    )
      key = "chemical";
    else if (state.a.smell === "rotten") key = "organic";
    else if (state.a.surface === "algae" || state.a.clarity === "green")
      key = "nutrients";
    else if (state.a.surface === "litter") key = "litter";
    else if (state.a.clarity === "murky" && state.a.rain === "heavy")
      key = "sediment";
    return {
      score,
      rows,
      story: STORIES[key],
      confidence: Math.max(50, state.confidence),
    };
  }
  function finish() {
    const r = compute(),
      grade =
        r.score >= 90
          ? "Healthy"
          : r.score >= 65
            ? "Fair"
            : r.score >= 40
              ? "Stressed"
              : "Critical",
      keptCount = state.resolved.filter(
        (x) => x.decision === "Kept by observer",
      ).length,
      recheckedCount = state.resolved.filter(
        (x) => x.decision === "Rechecked",
      ).length,
      rawConfidence = 90 - keptCount * 10 - recheckedCount * 4;
    show("reportView");
    $("#reportMode").textContent = state.sample
      ? "Sample report"
      : "Stream health snapshot";
    $("#reportLocation").textContent = state.a.location;
    $("#reportDate").textContent = formatFieldDate();
    $("#gradeText").textContent = grade;
    $("#confidenceText").textContent = r.confidence + "%";
    $("#confidenceBar").style.width = r.confidence + "%";
    $("#confidenceNote").innerHTML =
      `<strong>How this was calculated:</strong> 90% complete-check baseline − ${keptCount} × 10 points for kept flags − ${recheckedCount} × 4 points for rechecks = ${rawConfidence}%.${rawConfidence < 50 ? " The 50% minimum sets the displayed result to 50%." : ""} Rechecking costs fewer points than keeping a flagged answer unchanged.`;
    $("#reasons").innerHTML = r.rows.length
      ? r.rows
          .sort((a, b) => b.pts - a.pts)
          .map(
            (x) =>
              `<div class="reason"><b>${esc(x.label)}</b><span class="pts">${x.pts < 0 ? "+" : "−"}${Math.abs(x.pts)}</span><p>${esc(x.why)}</p></div>`,
          )
          .join("")
      : `<p class="empty-reason">No deductions. The observations are internally consistent with a healthy-looking stretch.</p>`;
    $("#storyHeading").textContent = r.story.title;
    $("#storyCopy").innerHTML =
      `<div><h4>Ecosystem</h4><p>${r.story.eco}</p></div><div><h4>People</h4><p>${r.story.people}</p></div><div class="next-step"><strong>Do next</strong>${r.story.action}</div>`;
    $("#crosschecks").innerHTML =
      `<p class="section-label">Human cross-checks</p>` +
      (state.sample
        ? `<p><b>Demonstration place:</b> ${esc(state.a.location)} <span>· fictional sample</span></p>`
        : `<p><b>Place confirmed by observer:</b> ${esc(state.a.location)} <span aria-label="not map verified">· not map-verified</span></p>`) +
      (state.resolved.length
        ? state.resolved
            .map((x) => `<p><b>${x.decision}:</b> ${esc(x.title)}</p>`)
            .join("")
        : "<p>No observation contradictions found.</p>");
    const scoreEl = $("#scoreNum"),
      begin = performance.now();
    function tick(t) {
      let p = Math.min(1, (t - begin) / 900),
        e = 1 - Math.pow(1 - p, 3);
      scoreEl.textContent = Math.round(r.score * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function back() {
    if (state.i > 0 && !state.recheck) {
      state.i--;
      renderQuestion();
    }
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-action]");
    if (!a) return;
    if (a.dataset.action === "start") start();
    if (a.dataset.action === "sample") sampleReport();
    if (a.dataset.action === "home") show("landingView");
  });
  const CUE_COPY = {
    clarity: "Start at the bank: can you still see the bottom?",
    outlet: "Scan both banks for pipes, drains or a single discoloured flow.",
    wildlife:
      "Pause for ten quiet seconds. Movement often returns when you stop.",
  };
  document.querySelectorAll(".field-cue").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".field-cue")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      $("#cueNote").textContent = CUE_COPY[button.dataset.cue];
    }),
  );
  $("#backBtn").addEventListener("click", back);
  $("#nextBtn").addEventListener("click", next);
})();
