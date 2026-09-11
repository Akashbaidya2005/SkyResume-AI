const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400); };

const templates = ['Minimal', 'Modern', 'Executive', 'Creative', 'Classic', 'Bold', 'Timeline', 'Portfolio', 'Elegant', 'Impact'];
const accentColors = [
  ['purple', 'Electric purple', '#6857e8'], ['blue', 'Ocean blue', '#3979d8'], ['green', 'Mint green', '#299b78'],
  ['orange', 'Warm orange', '#df824e'], ['coral', 'Coral pink', '#df6275'], ['navy', 'Midnight navy', '#263b6b'],
  ['teal', 'Deep teal', '#168b8b'], ['gold', 'Golden hour', '#c28b27'], ['red', 'Ruby red', '#c94b57'],
  ['lavender', 'Soft lavender', '#8d70c8'], ['slate', 'Slate gray', '#536273'], ['lime', 'Fresh lime', '#68a83e']
];
function renderColorSwatches() {
  $('#colorSwatches').innerHTML = accentColors.map(([value, label, color], i) => `<button type="button" class="color-swatch ${i === 0 ? 'selected' : ''}" data-color="${value}" data-value="${color}" title="${label}" aria-label="${label}" style="--swatch:${color}"></button>`).join('');
  $$('.color-swatch').forEach(swatch => swatch.addEventListener('click', () => {
    $$('.color-swatch').forEach(item => item.classList.remove('selected'));
    swatch.classList.add('selected');
    document.documentElement.style.setProperty('--purple', swatch.dataset.value);
    document.documentElement.style.setProperty('--purple-light', `${swatch.dataset.value}18`);
    toast(`${swatch.title} accent applied`);
  }));
}
function renderTemplates() {
  const grid = $('#templateGrid');
  grid.innerHTML = templates.map((name, i) => `<div class="template-tile ${i === 1 ? 'selected' : ''}" data-template="${name}"><div class="template-paper template-${name.toLowerCase()}"><div class="line dark"></div><div class="line short"></div><div class="line"></div><div class="line short"></div><div class="line"></div></div><small>${name}</small></div>`).join('');
  $$('.template-tile').forEach(tile => tile.addEventListener('click', () => { $$('.template-tile').forEach(t => t.classList.remove('selected')); tile.classList.add('selected'); toast(`${tile.dataset.template} template selected`); }));
}

function updateScore(delta = 0) {
  const value = Math.min(99, Math.max(62, Number($('#scoreValue').textContent) + delta));
  $('#scoreValue').textContent = value;
  $('.progress-line span').style.width = `${value}%`;
  $('.score-ring').style.background = `conic-gradient(var(--purple) 0 ${value}%, #ebe9f6 ${value}% 100%)`;
}

$$('.nav-item[data-view]').forEach(button => button.addEventListener('click', () => {
  $$('.nav-item[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active');
  const messages = { builder: 'Resume builder is ready.', templates: 'Choose a template in the Design tab.', ats: 'Your resume is currently 82% ATS-ready.', tailor: 'Paste a job description to tailor your resume.' };
  toast(messages[button.dataset.view]);
  if (button.dataset.view === 'templates') $('.tab[data-tab="design"]').click();
}));

$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => t.classList.remove('active')); tab.classList.add('active');
  $$('.tab-content').forEach(content => content.classList.add('hidden'));
  $(`#${tab.dataset.tab}Tab`).classList.remove('hidden');
  if (tab.dataset.tab === 'design') renderTemplates();
}));

$('#summary').addEventListener('input', (event) => { $('#summaryCount').textContent = `${event.target.value.length} / 500`; });
$('#summaryAi').addEventListener('click', () => { $('#summary').value = 'Product designer with 6+ years of experience creating intuitive, accessible digital products used by millions. I combine user research, systems thinking, and rapid prototyping to turn complex problems into simple, delightful experiences. Known for partnering closely with engineering to ship measurable improvements.'; $('#summary').dispatchEvent(new Event('input')); updateScore(4); toast('AI improved your professional summary'); });
$('#rescanBtn').addEventListener('click', () => { updateScore(); toast('ATS scan refreshed — your resume is looking strong'); });
$('#scanBtn').addEventListener('click', () => { updateScore(3); toast('Scan complete — 3 keyword opportunities found'); });
$('#saveBtn').addEventListener('click', () => toast('All changes saved just now'));
$('#upgradeCta').addEventListener('click', () => toast('Pro plan preview: unlimited scans, tailoring, and premium designs'));
$('.upgrade-btn').addEventListener('click', () => toast('Pro plan preview: unlimited scans, tailoring, and premium designs'));
$('#addExperience').addEventListener('click', () => { const card = document.createElement('article'); card.className = 'experience-card collapsed'; card.innerHTML = '<div class="card-top"><div><strong>New position</strong><span>Company name · Location</span></div><button class="more-btn">•••</button></div><div class="experience-meta">Add dates</div><div class="card-actions"><button class="edit-experience">✎ Edit</button><button class="delete-experience">♲ Remove</button></div>'; $('#experienceList').append(card); bindExperienceActions(card); toast('New experience added'); });
function bindExperienceActions(root = document) { $$('.delete-experience', root).forEach(btn => btn.addEventListener('click', () => { btn.closest('.experience-card').remove(); toast('Experience removed'); })); $$('.edit-experience', root).forEach(btn => btn.addEventListener('click', () => toast('Experience editor is ready to customize'))); }
bindExperienceActions();
const normalizeSkill = value => value.trim().toLowerCase();
function addSkillChip(value) {
  const skill = value.trim();
  if (!skill) return false;
  const existing = $$('.skill-chip').some(chip => normalizeSkill(chip.textContent.replace('×', '')) === normalizeSkill(skill));
  if (existing) return false;
  const chip = document.createElement('span');
  chip.className = 'skill-chip';
  chip.innerHTML = `${skill} <button type="button" aria-label="Remove ${skill}">×</button>`;
  $('#skillChips').append(chip);
  chip.querySelector('button').addEventListener('click', () => chip.remove());
  return true;
}
$('#skillField').addEventListener('keydown', (event) => { if (event.key !== 'Enter') return; if (addSkillChip(event.target.value)) updateScore(1); event.target.value = ''; });
$$('.skill-chip button').forEach(btn => btn.addEventListener('click', () => btn.parentElement.remove()));
$('#addSkill').addEventListener('click', () => { $('#skillField').focus(); toast('Type a skill and press Enter'); });
$$('.suggestion-action').forEach(btn => btn.addEventListener('click', () => { if (btn.dataset.suggestion === 'keyword') { const input = $('#skillField'); input.value = 'A/B testing'; input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); } else { toast('Impact suggestion applied to your experience'); } updateScore(3); btn.closest('.suggestion').remove(); }));
function openTailor() { $('#tailorModal').classList.remove('hidden'); $('#tailorResults').classList.add('hidden'); }
$('#tailorBtn').addEventListener('click', openTailor);
$$('.nav-item[data-view="tailor"]').forEach(button => button.addEventListener('click', openTailor));
$('#closeTailor').addEventListener('click', () => $('#tailorModal').classList.add('hidden'));
$('#tailorModal').addEventListener('click', e => { if (e.target.id === 'tailorModal') e.currentTarget.classList.add('hidden'); });
$('#analyzeJob').addEventListener('click', () => {
  const description = $('#jobDescription').value.toLowerCase();
  const terms = ['user research', 'figma', 'prototyping', 'design systems', 'a/b testing', 'cross-functional collaboration', 'accessibility'];
  const skills = $$('.skill-chip').map(chip => chip.textContent.replace('×', '').trim().toLowerCase());
  const keywords = terms.map(term => `<span class="keyword ${skills.includes(term) || description.includes(term) && skills.some(skill => skill.includes(term)) ? 'match' : 'missing'}">${term}</span>`).join('');
  $('#keywordList').innerHTML = keywords;
  $('#tailorResults').classList.remove('hidden');
  toast('Job match analyzed — review your missing keywords');
});
$('#applyKeywords').addEventListener('click', () => {
  const missingKeywords = $$('.keyword.missing', $('#tailorResults')).map(keyword => keyword.textContent);
  const addedKeywords = missingKeywords.filter(addSkillChip);
  if (!addedKeywords.length) {
    toast('All missing keywords are already in your skills');
    return;
  }
  updateScore(Math.min(8, addedKeywords.length * 2));
  $('#tailorModal').classList.add('hidden');
  toast(`${addedKeywords.length} missing keyword${addedKeywords.length === 1 ? '' : 's'} added to your skills`);
});
$('#fontSelect').addEventListener('change', event => { const fonts = { modern: 'Inter, ui-sans-serif, sans-serif', classic: 'Georgia, serif', editorial: 'Palatino, Georgia, serif', humanist: 'Trebuchet MS, sans-serif', mono: 'ui-monospace, SFMono-Regular, monospace', rounded: 'Arial Rounded MT Bold, Trebuchet MS, sans-serif' }; document.documentElement.style.setProperty('--resume-font', fonts[event.target.value]); document.body.style.fontFamily = fonts[event.target.value]; toast(`${event.target.options[event.target.selectedIndex].text} font applied`); });
$('#densitySelect').addEventListener('change', event => { document.documentElement.dataset.density = event.target.value; toast(`${event.target.options[event.target.selectedIndex].text} layout applied`); });
function syncPreview() { $('#previewName').textContent = $('#fullName').value; $('#previewTitle').textContent = $('#jobTitle').value; $('#previewContact').textContent = `${$('#email').value}  ·  ${$('#phone').value}  ·  ${$('#location').value}`; $('#previewSummary').textContent = $('#summary').value; $('#previewSkills').textContent = $$('.skill-chip').map(chip => chip.textContent.replace('×', '').trim()).join('  ·  '); }
$('#previewBtn').addEventListener('click', () => { syncPreview(); $('#previewModal').classList.remove('hidden'); }); $('#closeModal').addEventListener('click', () => $('#previewModal').classList.add('hidden')); $('#previewModal').addEventListener('click', e => { if (e.target.id === 'previewModal') e.currentTarget.classList.add('hidden'); });
$('#downloadBtn').addEventListener('click', () => { syncPreview(); const printWindow = window.open('', '_blank'); if (!printWindow) { toast('Allow pop-ups to download your resume'); return; } printWindow.document.write(`<html><head><title>${$('#fullName').value} Resume</title><style>body{font:14px Arial;color:#222;max-width:760px;margin:50px auto;line-height:1.5}h1{margin-bottom:4px}h4{color:#6857e8;letter-spacing:1px;border-bottom:1px solid #ddd;padding-bottom:6px;margin-top:26px}</style></head><body><h1>${$('#previewName').textContent}</h1><strong>${$('#previewTitle').textContent}</strong><p>${$('#previewContact').textContent}</p><h4>SUMMARY</h4><p>${$('#previewSummary').textContent}</p><h4>EXPERIENCE</h4><p><strong>Senior Product Designer · Northstar Labs</strong><br>Led end-to-end design for the core analytics platform, increasing weekly active users by 38%.</p><h4>SKILLS</h4><p>${$('#previewSkills').textContent}</p></body></html>`); printWindow.document.close(); printWindow.print(); });
renderColorSwatches();
renderTemplates();
