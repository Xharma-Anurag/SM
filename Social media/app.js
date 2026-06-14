const form = document.querySelector("#storyForm");
const generateBtn = document.querySelector("#generateBtn");
const loadSampleBtn = document.querySelector("#loadSampleBtn");
const outputText = document.querySelector("#outputText");
const copyBtn = document.querySelector("#copyBtn");
const saveDraftBtn = document.querySelector("#saveDraftBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const toast = document.querySelector("#toast");
const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const readinessBar = document.querySelector("#readinessBar");
const readinessText = document.querySelector("#readinessText");
const qualityScore = document.querySelector("#qualityScore");
const qualityNote = document.querySelector("#qualityNote");
const hookScore = document.querySelector("#hookScore");
const proofScore = document.querySelector("#proofScore");
const ctaScore = document.querySelector("#ctaScore");
const depth = document.querySelector("#depth");
const depthLabel = document.querySelector("#depthLabel");
const angleCard = document.querySelector("#angleCard");
const outputPanel = document.querySelector(".output-panel");
const previewLinkedIn = document.querySelector("#previewLinkedIn");
const previewLinkedInMeta = document.querySelector("#previewLinkedInMeta");
const previewInstagram = document.querySelector("#previewInstagram");
const previewInstagramMeta = document.querySelector("#previewInstagramMeta");
const previewYouTube = document.querySelector("#previewYouTube");
const previewYouTubeMeta = document.querySelector("#previewYouTubeMeta");

const STORAGE_KEY = "student-story-engine-draft";

let activeTab = "linkedin";
let storyPack = {
  linkedin: "",
  instagram: "",
  youtube: "",
  testimonial: ""
};

const sampleStory = {
  studentName: "Aisha Khan",
  programName: "Full Stack Web Development",
  organizationName: "BrightPath Academy",
  audience: "prospective students",
  achievement: "Placed as a junior developer after completing three portfolio projects and clearing two technical interviews.",
  challenge: "Before joining, Aisha knew basic HTML but struggled to build complete projects, explain her work, and prepare for interviews.",
  proofPoints: "Built a job portal, a learning dashboard, and a portfolio site. Completed 18 mock interview sessions and received 2 offer letters.",
  storyAngle: "career",
  ctaCustom: "Book a free career counselling call",
  tone: "inspiring",
  depth: "2",
  platforms: ["linkedin", "instagram", "youtube", "testimonial"]
};

const toneMap = {
  inspiring: {
    hook: "A student success story worth sharing",
    voice: "confident, hopeful, and momentum-driven",
    cta: "If you are ready to build your own success story, start with one focused step today."
  },
  professional: {
    hook: "Student outcome spotlight",
    voice: "clear, credible, and outcome-focused",
    cta: "Connect with our admissions team to learn how structured training supports career-ready outcomes."
  },
  warm: {
    hook: "A proud milestone from our learning community",
    voice: "human, supportive, and trust-building",
    cta: "Every learner's journey begins differently. The right support can turn steady effort into a meaningful result."
  }
};

const depthMap = {
  "1": { label: "Short", detail: "Keep it concise and direct." },
  "2": { label: "Balanced", detail: "Use a clear story arc with proof." },
  "3": { label: "Detailed", detail: "Add richer context and stronger narrative framing." }
};

const angleMap = {
  career: {
    label: "Career transformation",
    lens: "Frame the achievement as a visible move from learning to opportunity.",
    hook: "From learning mode to career momentum",
    proofPrompt: "career-ready proof"
  },
  confidence: {
    label: "Confidence journey",
    lens: "Focus on the student's growth in clarity, practice, and self-belief.",
    hook: "The confidence shift behind the outcome",
    proofPrompt: "confidence-building moments"
  },
  project: {
    label: "Project-led proof",
    lens: "Lead with portfolio work, practical skill, and tangible evidence.",
    hook: "Proof of skill, built one project at a time",
    proofPrompt: "portfolio evidence"
  },
  community: {
    label: "Learning community",
    lens: "Show how mentorship, peers, and structured support shaped the result.",
    hook: "A win shaped by support and steady practice",
    proofPrompt: "support-system signals"
  }
};

function getFormData() {
  const data = new FormData(form);
  return {
    studentName: clean(data.get("studentName")),
    programName: clean(data.get("programName")),
    organizationName: clean(data.get("organizationName")),
    audience: data.get("audience"),
    achievement: clean(data.get("achievement")),
    challenge: clean(data.get("challenge")),
    proofPoints: clean(data.get("proofPoints")),
    storyAngle: data.get("storyAngle") || "career",
    ctaCustom: clean(data.get("ctaCustom")),
    tone: data.get("tone") || "inspiring",
    depth: data.get("depth") || "2",
    platforms: data.getAll("platforms")
  };
}

function clean(value) {
  return String(value || "").trim();
}

function fallback(value, replacement) {
  return value || replacement;
}

function buildContext(data) {
  const student = fallback(data.studentName, "the student");
  const program = fallback(data.programName, "the program");
  const organization = fallback(data.organizationName, "the organization");
  const achievement = fallback(data.achievement, "reached an important learning milestone");
  const challenge = fallback(data.challenge, "needed structure, feedback, and confidence");
  const proof = fallback(data.proofPoints, "completed projects, practiced consistently, and showed measurable progress");
  const tone = toneMap[data.tone] || toneMap.inspiring;
  const depthInfo = depthMap[data.depth] || depthMap["2"];
  const angle = angleMap[data.storyAngle] || angleMap.career;
  const cta = fallback(data.ctaCustom, tone.cta);

  return { student, program, organization, achievement, challenge, proof, tone, depthInfo, angle, cta };
}

function generateLinkedIn(data) {
  const c = buildContext(data);
  const extra = data.depth === "3"
    ? `\n\nWhat makes this story powerful is the process behind the outcome: focused learning, repeated practice, project reviews, and the willingness to keep improving after every feedback cycle. That gives ${data.audience} something more valuable than a claim. It gives them evidence.`
    : "";

  return `${c.angle.hook}: ${c.student}\n\n${c.student} joined ${c.organization}'s ${c.program} journey with a clear challenge: ${c.challenge}.\n\nThe breakthrough: ${c.achievement}.\n\nThe proof behind the progress: ${c.proof}.\n\nWhy this matters for ${data.audience}: it turns a student outcome into a believable story of effort, guidance, and visible growth.${extra}\n\nCampaign angle: ${c.angle.lens}\n\n${c.cta}.\n\n#StudentSuccess #EducationMarketing #CareerGrowth #LearningOutcomes`;
}

function generateInstagram(data) {
  const c = buildContext(data);
  const detailLine = data.depth === "1"
    ? `${c.student}'s achievement: ${c.achievement}.`
    : `${c.student} moved from "${c.challenge}" to "${c.achievement}" with support from ${c.organization}'s ${c.program}.`;

  return `Slide 1: ${c.student}'s win deserves the spotlight\n\nSlide 2: Before joining\n${c.challenge}\n\nSlide 3: The turning point\n${detailLine}\n\nSlide 4: Proof that made the story stronger\n${formatProofBullets(c.proof)}\n\nCaption:\nFor ${data.audience}, this is more than a result. It is a story about what becomes possible when learning is structured, feedback is consistent, and progress is visible.\n\n${c.cta}.\n\n#StudentStory #SkillDevelopment #SuccessStory #Education`;
}

function generateYouTube(data) {
  const c = buildContext(data);
  const detail = data.depth === "3"
    ? `\nScene 5: Show the proof assets quickly.\nOn-screen text: "${c.proof}."\nVoiceover: "The strongest stories are backed by visible proof, not vague promises."\n\nScene 6: Close with the bigger message: student outcomes become powerful when training creates confidence, proof, and a clear next step.`
    : "";

  return `YouTube Shorts Script: ${c.student}'s Student Success Story\n\nScene 1: Open with a strong hook.\nOn-screen text: "${c.angle.hook}"\nVoiceover: "${c.student} started with a challenge many learners know well: ${c.challenge}."\n\nScene 2: Show the learning journey.\nVoiceover: "Through ${c.organization}'s ${c.program}, the focus became practice, feedback, and real project work."\n\nScene 3: Reveal the achievement.\nVoiceover: "${c.student} ${c.achievement}."\n\nScene 4: Add ${c.angle.proofPrompt}.\nOn-screen text: "${c.proof}."\nVoiceover: "That proof turned the story into something credible for ${data.audience}."${detail}\n\nClosing CTA: "${c.cta}."`;
}

function generateTestimonial(data) {
  const c = buildContext(data);
  const perspective = data.audience === "parents"
    ? "support, structure, and visible progress"
    : "practical learning, mentorship, and confidence";

  return `Testimonial Narrative\n\n"${c.organization} helped me move from ${c.challenge} to ${c.achievement}. The ${c.program} experience gave me ${perspective}. The biggest proof of my progress was: ${c.proof}."\n\nMarketing summary\n\n${c.student}'s story gives ${data.audience} a clear reason to trust ${c.organization}: the learning journey is connected to visible outcomes, practical proof, and a human transformation that feels achievable.\n\nBest page placement\nUse this testimonial near admissions CTAs, course outcome sections, lead forms, and campaign follow-up messages.`;
}

function formatProofBullets(proof) {
  const parts = proof
    .split(/[.;]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return "- Completed meaningful practice\n- Built confidence\n- Created visible proof of progress";
  }

  return parts.map((part) => `- ${part}`).join("\n");
}

function generateStoryPack() {
  const data = getFormData();
  storyPack = {
    linkedin: generateLinkedIn(data),
    instagram: generateInstagram(data),
    youtube: generateYouTube(data),
    testimonial: generateTestimonial(data)
  };

  outputText.value = storyPack[activeTab];
  updateQuality(data);
  updateReadiness();
  updateAngleCard(data);
  updatePreviews(data);
  pulseOutput();
  saveState();
  showToast("Story pack generated.");
}

function updateQuality(data = getFormData()) {
  const fields = ["studentName", "programName", "organizationName", "achievement", "challenge", "proofPoints"];
  const filledCount = fields.filter((field) => data[field]).length;
  const hasPlatforms = data.platforms.length > 0;
  const score = Math.round(((filledCount / fields.length) * 85) + (hasPlatforms ? 15 : 0));

  qualityScore.textContent = `${score}%`;
  hookScore.textContent = data.achievement ? "Strong" : "Needs outcome";
  proofScore.textContent = data.proofPoints ? "Evidence added" : "Add proof";
  ctaScore.textContent = data.audience ? "Audience-aware" : "Pending";
  qualityNote.textContent = score >= 85
    ? "This story has enough detail for credible campaign content."
    : "Add more specific details to improve trust and channel fit.";
}

function updateReadiness() {
  const data = getFormData();
  const required = ["studentName", "programName", "organizationName", "achievement", "challenge", "proofPoints"];
  const complete = required.filter((field) => data[field]).length;
  const percent = Math.round((complete / required.length) * 100);

  readinessBar.style.width = `${percent}%`;
  readinessText.textContent = percent === 100
    ? "Ready for platform-specific publishing."
    : `${complete} of ${required.length} core story fields completed.`;
}

function setActiveTab(tab) {
  activeTab = tab;
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  outputText.value = storyPack[tab] || "";
  saveState();
}

function loadSample() {
  form.studentName.value = sampleStory.studentName;
  form.programName.value = sampleStory.programName;
  form.organizationName.value = sampleStory.organizationName;
  form.audience.value = sampleStory.audience;
  form.storyAngle.value = sampleStory.storyAngle;
  form.ctaCustom.value = sampleStory.ctaCustom;
  form.achievement.value = sampleStory.achievement;
  form.challenge.value = sampleStory.challenge;
  form.proofPoints.value = sampleStory.proofPoints;
  form.depth.value = sampleStory.depth;

  form.querySelectorAll("[name='tone']").forEach((input) => {
    input.checked = input.value === sampleStory.tone;
  });
  form.querySelectorAll("[name='platforms']").forEach((input) => {
    input.checked = sampleStory.platforms.includes(input.value);
  });

  updateDepthLabel();
  generateStoryPack();
}

function saveState() {
  const state = {
    data: getFormData(),
    storyPack,
    activeTab,
    output: outputText.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    updateDepthLabel();
    updateReadiness();
    return;
  }

  try {
    const state = JSON.parse(saved);
    const data = state.data || {};
    form.studentName.value = data.studentName || "";
    form.programName.value = data.programName || "";
    form.organizationName.value = data.organizationName || "";
    form.audience.value = data.audience || "prospective students";
    form.storyAngle.value = data.storyAngle || "career";
    form.ctaCustom.value = data.ctaCustom || "";
    form.achievement.value = data.achievement || "";
    form.challenge.value = data.challenge || "";
    form.proofPoints.value = data.proofPoints || "";
    form.depth.value = data.depth || "2";

    form.querySelectorAll("[name='tone']").forEach((input) => {
      input.checked = input.value === (data.tone || "inspiring");
    });
    form.querySelectorAll("[name='platforms']").forEach((input) => {
      input.checked = (data.platforms || []).includes(input.value);
    });

    storyPack = state.storyPack || storyPack;
    setActiveTab(state.activeTab || "linkedin");
    outputText.value = state.output || storyPack[activeTab] || "";
    updateDepthLabel();
    updateQuality(data);
    updateReadiness();
    updateAngleCard(data);
    updatePreviews(data);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

async function copyOutput() {
  if (!outputText.value.trim()) {
    showToast("Generate content before copying.");
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    showToast("Copied to clipboard.");
  } catch (error) {
    outputText.select();
    document.execCommand("copy");
    showToast("Copied.");
  }
}

function downloadOutput() {
  if (!outputText.value.trim()) {
    showToast("Generate content before downloading.");
    return;
  }

  const data = getFormData();
  const fileName = `${fallback(data.studentName, "student").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activeTab}-story.txt`;
  const blob = new Blob([outputText.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Download started.");
}

function saveDraft() {
  storyPack[activeTab] = outputText.value;
  saveState();
  showToast("Draft saved in this browser.");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function updateDepthLabel() {
  depthLabel.textContent = depthMap[depth.value].label;
}

function updateAngleCard(data = getFormData()) {
  const angle = angleMap[data.storyAngle] || angleMap.career;
  angleCard.querySelector("strong").textContent = angle.label;
  angleCard.querySelector("span").textContent = angle.lens;
}

function updatePreviews(data = getFormData()) {
  const c = buildContext(data);
  const proofCount = formatProofBullets(c.proof).split("\n").length;
  const ctaStatus = data.ctaCustom ? "custom CTA" : "default CTA";

  previewLinkedIn.textContent = c.angle.hook;
  previewLinkedInMeta.textContent = `${c.student} story for ${data.audience} with ${ctaStatus}.`;
  previewInstagram.textContent = `${proofCount}-part proof carousel`;
  previewInstagramMeta.textContent = `Before, breakthrough, proof, and caption built around ${c.angle.label.toLowerCase()}.`;
  previewYouTube.textContent = `${data.depth === "3" ? "6" : "4"}-scene Shorts script`;
  previewYouTubeMeta.textContent = `Narrated for ${c.tone.voice} delivery.`;
}

function pulseOutput() {
  outputPanel.classList.remove("is-fresh");
  window.requestAnimationFrame(() => {
    outputPanel.classList.add("is-fresh");
    window.setTimeout(() => outputPanel.classList.remove("is-fresh"), 600);
  });
}

generateBtn.addEventListener("click", generateStoryPack);
loadSampleBtn.addEventListener("click", loadSample);
copyBtn.addEventListener("click", copyOutput);
saveDraftBtn.addEventListener("click", saveDraft);
downloadBtn.addEventListener("click", downloadOutput);
depth.addEventListener("input", () => {
  updateDepthLabel();
  updateReadiness();
});
form.addEventListener("input", () => {
  updateReadiness();
  updateAngleCard();
  updatePreviews();
  saveState();
});
outputText.addEventListener("input", () => {
  storyPack[activeTab] = outputText.value;
  saveState();
});
tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

restoreState();
updateAngleCard();
updatePreviews();
