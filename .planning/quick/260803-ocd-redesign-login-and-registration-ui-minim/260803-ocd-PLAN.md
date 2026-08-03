---
phase: 260803-ocd
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [public/css/login.css, views/login.html, views/register.html, routes/index.js]
autonomous: false
requirements: [QUICK-260803-OCD]

must_haves:
  truths:
    - "Login page renders the new minimalist-futuristic design and still posts natively to POST /login"
    - "Register page renders the new design and still submits via fetch JSON to POST /register"
    - "A polished full-screen loading modal appears during form submission on both pages"
    - "All error messages (top banner + inline field messages) read friendly and human"
    - "Dark/light theme toggle still works and persists via localStorage 'pw-theme'"
    - "verify-otp.html renders unbroken (it shares login.css legacy selectors)"
  artifacts:
    - path: "public/css/login.css"
      provides: "Redesigned auth stylesheet incl. .auth-loading overlay and ALL legacy selectors"
      contains: ".auth-loading"
    - path: "views/login.html"
      provides: "Login page with loading overlay markup + friendly error copy"
      contains: "auth-loading"
    - path: "views/register.html"
      provides: "Register page with loading overlay markup + friendly error copy"
      contains: "auth-loading"
    - path: "routes/index.js"
      provides: "POST /login catch block redirects with friendly ?error= instead of plain-text 500"
      contains: "Something went wrong"
  key_links:
    - from: "views/login.html <form>"
      to: "POST /login"
      via: "native submit (action=\"/login\" method=\"POST\") — unchanged"
      pattern: "action=\"/login\""
    - from: "views/register.html script"
      to: "POST /register"
      via: "fetch JSON — unchanged"
      pattern: "fetch\\('/register'"
    - from: "views/login.html banner script"
      to: "?error= query param"
      via: "URLSearchParams + friendly message map"
      pattern: "URLSearchParams"
    - from: "public/css/login.css"
      to: "views/verify-otp.html"
      via: "shared legacy selectors (.login-container, .login-card, .otp-input, etc.)"
      pattern: "\\.login-container"
---

<objective>
Redesign the login and registration pages into a minimalist-futuristic aesthetic that stays on the agriculture theme, add a full-screen loading modal during submission on both pages, and make every error message friendly/human — without breaking form contracts, routes, server validation, the theme toggle, or verify-otp.html.

Purpose: First impression of the platform; current biophilic split-auth works but the user wants a cleaner, futuristic look and warmer error UX.
Output: Rewritten `public/css/login.css`, updated `views/login.html` + `views/register.html`, tiny `routes/index.js` 500-fallback improvement.
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@views/login.html
@views/register.html
@views/verify-otp.html
@public/css/login.css

<interfaces>
<!-- Server contract (routes/index.js) — DO NOT CHANGE field names, routes, or validation logic -->
POST /login    ← urlencoded form: { email, password, remember? }
               → success: redirect /admin/dashboard or /farmer/dashboard
               → failure: redirect /login?error=<msg>   (client banner reads ?error=)
               → catch: currently res.status(500).send('Login failed...')  ← improve to friendly redirect

POST /register ← JSON: { full_name, contact_number?, email, password, identity_type, identity_specification?, confirm_password }
               → { success:true, redirectUrl:'/verify-otp?email=...' } | { error:'...' } (400/409/500)

Theme: <html data-theme="dark"> toggled by #themeToggle, persisted in localStorage key 'pw-theme'.
CSS is shared: views/verify-otp.html also links /css/login.css and uses legacy + OTP selectors.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite public/css/login.css — minimalist-futuristic theme + loading-overlay styles (preserve every existing selector)</name>
  <files>public/css/login.css</files>
  <action>
Rewrite the stylesheet to a minimalist-futuristic visual language while keeping the agriculture identity (green accent, sprout brand, field illustration panel). This is a RESTYLE — every selector currently consumed by login.html, register.html, and verify-otp.html MUST keep working. Do not rename or drop any of them.

DESIGN DIRECTION (locked — implement this, not an alternative):
- Tokens: keep the CSS custom-property system. Light theme: background near-white neutral (#F7F8F6), card pure #FFFFFF, hairline borders (#E4E8E3), text near-black green-tinted (#0F1A12), single vivid accent green (#16A34A, hover #15803D). Dark theme: background deep green-black (#0A100B), card as glass — rgba(255,255,255,0.03) with `backdrop-filter: blur(12px)` and 1px rgba(255,255,255,0.08) border, accent brightens to #4ADE80. Keep semantic tokens (destructive/success/warning/info + soft variants) — validation states depend on them.
- Futuristic minimal cues: 16px card radius with ONE soft shadow (drop the layered heavy shadows); field labels become micro-labels — 11–12px, uppercase, letter-spacing 0.08em, weight 600, muted color; headings keep Inter with tight letter-spacing (-0.02em); generous whitespace; inputs flat with hairline border + subtle tinted bg, focus = accent border + 3px soft accent ring (keep --shadow-focus pattern).
- Agriculture anchor: keep the green palette family, the .brand-mark sprout tile, and the .auth-visual illustration panel — restyle the panel as a deep calm gradient (e.g. #052E16 → #064E3B → #065F46) with the SVG art toned down (opacity ~0.5) and light text; do NOT delete .auth-visual__* selectors or the features list styles.
- Buttons: .btn-primary stays accent green, radius 10–12px, flat, subtle hover lift; keep .is-loading state machine exactly (label/sprout hidden, spinner + loading-text shown) — login.html/register.html JS toggles this class.
- Keep ALL keyframes currently referenced by HTML/JS: shakeError, fadeIn, fadeInUp, fadeOut, breath, spin, rise, strokeCheckmark, fillCheckmark, scaleCheckmark (verify-otp.html JS calls fadeOut/fadeInUp by name).
- Keep `@media (prefers-reduced-motion: reduce)` guard and responsive breakpoints (1024px / 640px / 380px).

MANDATORY SELECTOR PRESERVATION LIST (automated verify will fail without these):
.login-container, .login-card, .login-form, .login-btn, .form-error, .weather-icon, .subtitle, .register-prompt, .verify-card, .success-card, .success-animation, .checkmark-circle, .checkmark-circle-line, .checkmark-check, .success-title, .success-subtitle, .redirect-box, .redirect-progress-bar, .redirect-progress-fill, .redirect-text, .success-btn, .otp-inputs-container, .otp-input (+ .error-pulse), .auth-shell, .auth-visual (+__art/__content/__eyebrow/.dot/__headline/__sub/__features/__footer), .brand-mark (+__logo/__name), .brand-mobile, .feature-dot, .auth-panel, .auth-card (+.register-card), .auth-title, .auth-subtitle, .auth-form, .field (+__label/__hint/__control/__icon/__input/__check/__message/__toggle, modifiers .field--toggle, .is-valid, .is-invalid, .shake), .form-meta, .checkbox-pair, .text-link, .auth-alert (+--error/--info/.is-visible), .btn-primary (+.btn-sprout/__label/__spinner/__loading-text/.is-loading), .spinner, .auth-footer, .identity-options, .identity-radio (+__box/__icon/__label, :checked states), .identity-specify-group, .password-strength, .strength-bar (+__seg s1–s4, [data-strength] variants), .strength-meta (+__label .tier-1..4/__hint), .password-requirements (+.req-title/.req-item/.req-met/.show), .theme-toggle (+.icon-light/.icon-dark dark-mode swap), :root[data-theme="dark"].

NEW — full-screen loading modal styles (class names locked; HTML in Task 2 uses exactly these):
- `.auth-loading` — position:fixed; inset:0; z-index:100; display:none; align-items:center; justify-content:center; background: color-mix or rgba(10,16,11,0.55); backdrop-filter: blur(8px); `.auth-loading.is-visible { display:flex; }`; entrance = fadeIn 0.2s.
- `.auth-loading__card` — glass card (var(--color-card), 1px hairline border, 16px radius, soft shadow, padding 32px 40px), centered column, gap 16px, text-align:center; min-width 260px.
- `.auth-loading__spinner` — 48px ring: 3px solid rgba(accent,0.2) with border-top-color accent, `animation: spin 0.8s linear infinite` (reuse existing spin keyframes).
- `.auth-loading__text` — 15px, weight 600, var(--text-primary); `.auth-loading__sub` — 13px, var(--text-secondary).

Style only — do not edit any HTML/JS in this task. Keep the file CommonJS-free (pure CSS), 4-space indentation per project CSS convention, no comments beyond brief section banners.
  </action>
  <verify>
    <automated>node -e "const c=require('fs').readFileSync('public/css/login.css','utf8');const req=['.login-container','.login-card','.login-form','.login-btn','.form-error','.weather-icon','.subtitle','.register-prompt','.verify-card','.success-card','.otp-inputs-container','.otp-input','.auth-shell','.auth-visual','.auth-panel','.auth-card','.auth-title','.auth-subtitle','.auth-form','.field__label','.field__control','.field__icon','.field__input','.field__check','.field__message','.field__toggle','.form-meta','.checkbox-pair','.text-link','.auth-alert','.btn-primary','.btn-sprout','.spinner','.auth-footer','.identity-options','.identity-radio__box','.identity-radio__icon','.identity-radio__label','.identity-specify-group','.password-strength','.strength-bar__seg','.strength-meta__label','.password-requirements','.req-item','.theme-toggle','.auth-loading','.auth-loading__card','.auth-loading__spinner','.auth-loading__text','is-visible','data-theme=\"dark\"','shakeError','fadeInUp','fadeOut','prefers-reduced-motion','backdrop-filter'];const m=req.filter(s=>!c.includes(s));if(m.length){console.error('MISSING:',m);process.exit(1)}console.log('OK: '+req.length+' selectors/keyframes present')"</automated>
  </verify>
  <done>login.css rewritten in the minimalist-futuristic direction; automated selector check passes (includes every verify-otp dependency and the new .auth-loading* overlay classes); dark theme and reduced-motion intact.</done>
</task>

<task type="auto">
  <name>Task 2: Add loading modal + friendly error copy to login.html & register.html; friendly 500 redirect in POST /login</name>
  <files>views/login.html, views/register.html, routes/index.js</files>
  <action>
A) BOTH PAGES — add this exact overlay markup once, right after the opening theme-toggle button (before .auth-shell):

    <div class="auth-loading" id="authLoading" role="alert" aria-live="assertive" aria-busy="true">
        <div class="auth-loading__card">
            <span class="auth-loading__spinner" aria-hidden="true"></span>
            <span class="auth-loading__text" id="authLoadingText">Signing you in…</span>
            <span class="auth-loading__sub">This will only take a moment.</span>
        </div>
    </div>

(register.html: text = "Creating your account…"). Helper JS on both pages: `function showLoading(msg){ if(msg) document.getElementById('authLoadingText').textContent = msg; document.getElementById('authLoading').classList.add('is-visible'); }` and `function hideLoading(){ document.getElementById('authLoading').classList.remove('is-visible'); }`.

B) login.html wiring:
- In the existing submit handler, after all validation passes (where `btn.classList.add('is-loading')` runs) also call `showLoading()`. Native POST continues; navigation clears the overlay — no hide needed on success path.
- Keep `action="/login" method="POST"`, input names `email`/`password`/`remember`, and all element IDs unchanged.
- Friendly banner: replace the direct `decodeURIComponent(errorMsg)` display with a small map keyed on the raw server string, falling back to the server text:
    'Invalid email or password.' → 'Those details don\'t match our records — please try again.'
    'Something went wrong on our end — please try again in a moment.' → show as-is (already friendly)
- Friendly inline copy (replace existing strings only — logic untouched):
    'Email is required.' → 'We need your email to sign you in.'
    'Please enter a valid email address.' → 'Hmm, that email doesn\'t look quite right.'
    'Password is required.' → 'Please enter your password.'
    'Password must be at least 8 characters.' → 'Passwords need at least 8 characters.'
    Keep positive 'Looks good.' as-is.

C) register.html wiring:
- In the fetch submit handler: after validation passes, call `showLoading()` alongside `submitBtn.classList.add('is-loading')`. On ANY failure path (result.error or catch), call `hideLoading()` before/at the same time as re-enabling the button. On success the page navigates to result.redirectUrl — overlay stays until navigation (fine).
- Friendly banner map for server `result.error` (fallback = server text):
    'An account with this email already exists.' → 'Looks like this email already has an account — try signing in instead.'
    'Missing required fields.' → 'A few required fields are missing — please check the form.'
    'Please provide a valid email address.' → 'Hmm, that email doesn\'t look quite right.'
    'Password does not meet security requirements.' → 'Almost — please check the password requirements below.'
    'Registration failed. Please try again.' → 'Something went wrong on our end — please try again in a moment.'
- Friendly inline copy:
    'Name is required.' → 'What should we call you?'
    'Name is too short.' → 'That name seems a bit short.'
    'Email is required.' → 'We need your email to create your account.'
    'Please enter a valid email.' → 'Hmm, that email doesn\'t look quite right.'
    'Enter a valid mobile number.' → 'That phone number doesn\'t look right — 10 to 11 digits, please.'
    'Password is required.' → 'You\'ll need a password to keep your account safe.'
    'Password does not meet all requirements.' → 'Almost — please check the password requirements below.'
    'Please confirm your password.' → 'Please type your password once more.'
    'Passwords do not match.' → 'These passwords don\'t match yet.'
    'Please fix the highlighted fields.' → 'Almost there — a few fields need a quick fix.'
    'Network error. Please try again.' → 'We couldn\'t reach the server — check your connection and try again.'
    'An error occurred during registration.' → 'Something went wrong on our end — please try again.'
- Keep input names `full_name`, `contact_number`, `email`, `password`, `confirm_password`, `identity_type`, `identity_specification`; keep `fetch('/register', ...)` JSON POST and all element IDs unchanged. Keep the theme-toggle and strength-meter logic untouched.

D) routes/index.js — POST /login catch block only (~line 287-290): replace `res.status(500).send('Login failed. Please try again.');` with:
    `res.redirect('/login?error=' + encodeURIComponent('Something went wrong on our end — please try again in a moment.'));`
Do NOT touch any other route, validation check, or the existing 'Invalid email or password.' redirects.
  </action>
  <verify>
    <automated>node -e "const fs=require('fs');const l=fs.readFileSync('views/login.html','utf8');const r=fs.readFileSync('views/register.html','utf8');const s=fs.readFileSync('routes/index.js','utf8');const checks=[[l,'action=\"/login\"','login action'],[l,'name=\"email\"','login email'],[l,'name=\"password\"','login pw'],[l,'auth-loading','login overlay'],[l,'showLoading','login showLoading'],[l,'URLSearchParams','login banner wiring'],[l,'pw-theme','login theme'],[r,'name=\"full_name\"','reg full_name'],[r,'name=\"contact_number\"','reg contact'],[r,'name=\"identity_type\"','reg identity'],[r,'name=\"confirm_password\"','reg confirm'],[r,\"fetch('/register'\",'reg fetch'],[r,'auth-loading','reg overlay'],[r,'hideLoading','reg hideLoading'],[r,'pw-theme','reg theme']];const bad=checks.filter(([c,x])=>!c.includes(x));if(bad.length){console.error('MISSING:',bad.map(b=>b[2]));process.exit(1)}if(s.includes(\"res.status(500).send('Login failed\")){console.error('old plain-text 500 still present');process.exit(1)}if(!s.includes('Something went wrong on our end')){console.error('friendly redirect missing in POST /login');process.exit(1)}console.log('OK: contracts preserved, overlay wired, 500 fallback friendly')"</automated>
  </verify>
  <done>Both pages show the full-screen overlay during submission; all error strings (banner + inline) are the friendly variants; form field names, routes, IDs, validation logic unchanged; POST /login catch redirects with a friendly ?error=.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Visual & functional verification of redesigned auth pages</name>
  <action>Present the verification steps below to the user and wait for their signal. Do not proceed past this checkpoint until the user responds. If issues are reported, fix them and re-run the failing step before asking again.</action>
  <what-built>Minimalist-futuristic restyle of login + register (shared login.css), full-screen loading modal on both submit paths, friendly banner/inline error copy, friendly POST /login 500 redirect, verify-otp.html styles preserved.</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open http://localhost:4000/login — confirm the new minimalist-futuristic look (hairline borders, micro-labels, deep-green visual panel, single soft shadow).
    2. Toggle dark/light with the top-right button — both pages restyle correctly; refresh and confirm the theme persists.
    3. Submit the login form empty → friendly inline messages ("We need your email to sign you in."), no overlay.
    4. Log in with wrong credentials → page returns to /login?error=... and banner shows "Those details don't match our records — please try again."
    5. Log in with valid credentials → full-screen loading modal (blurred backdrop, spinner, "Signing you in…") appears, then lands on the dashboard.
    6. Open http://localhost:4000/register — same design language; trigger inline errors (bad email, weak password, mismatched confirm) and confirm friendly copy; submit a valid form → modal shows "Creating your account…", then lands on /verify-otp.
    7. Open http://localhost:4000/verify-otp?email=test@example.com — page renders correctly (OTP boxes, card, buttons styled, nothing unstyled/broken).
    8. Optional: register with an already-used email → banner shows "Looks like this email already has an account — try signing in instead."
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| browser → POST /login, POST /register | User-controlled input crosses to server; server validation remains the source of truth (client copy changes are UX-only). |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-OCD-01 | Tampering | Form field names / route paths | mitigate | Preserve exact names (email, password, remember, full_name, contact_number, identity_type, identity_specification, confirm_password) and routes; automated verify asserts their presence |
| T-OCD-02 | Information Disclosure | Error banner copy (login + register) | mitigate | Friendly rewording stays generic — never reveals whether an email is registered; server's generic 'Invalid email or password.' retained and only reworded client-side; no new server-side messages except the generic 500 fallback |
| T-OCD-03 | Tampering | Client-side validation bypass | accept | Client validation is UX-only by design; server validation logic untouched and authoritative — residual risk identical to current behavior |
| T-OCD-04 | Denial of Service | Loading overlay (stuck state) | mitigate | Overlay only shown after validation passes; register hides it on every failure path; login navigates away on submit — no path leaves the page interactive-blocked |
</threat_model>

<verification>
- Task 1 automated selector/keyframes check passes (protects verify-otp.html regression).
- Task 2 automated contract check passes (field names, routes, overlay wiring, friendly 500).
- Task 3 human UAT confirms visuals, theme persistence, modal behavior, friendly errors, OTP page intact.
</verification>

<success_criteria>
- login.css restyled to minimalist-futuristic spec with 100% selector/keyframes preservation.
- Both auth pages show a polished full-screen loading modal during submission.
- Every user-facing error string (banner + inline) is friendly/human; server contract unchanged except the friendlier 500 redirect.
- Theme toggle works on both pages; verify-otp.html renders exactly as before.
</success_criteria>

<output>
After completion, create `.planning/quick/260803-ocd-redesign-login-and-registration-ui-minim/260803-ocd-SUMMARY.md`
</output>
