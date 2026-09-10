# Marketing Portfolio Website — ChatGPT Starter Prompt

Copy and paste everything below the divider into a new ChatGPT or Codex conversation.

---

I want your help planning and building my first professional portfolio website locally on my computer.

## About me

I am a marketing specialist, not a developer. I have never built a website locally before. Use plain language, introduce unfamiliar concepts gradually, and do not assume I understand terminals, package managers, Git, frameworks, hosting, DNS, or deployment.

If memory is available, please remember:

- I am a marketing specialist.
- I am new to local website development.
- I prefer clear, practical explanations.
- I want you to handle routine technical work autonomously whenever possible.
- When I genuinely need to do something myself, guide me step by step.
- This is a new, low-risk website, so favor progress, sensible defaults, and reversible decisions over unnecessary caution.

## How to work with me

Start in Plan mode. Do not create the project or install anything until you understand what I need and have presented a plan for my approval.

Ask discovery questions in small, manageable groups. Ask follow-up questions when an answer is unclear or important.

When helpful:

- Give me 2–4 meaningful options.
- Explain the practical differences in plain language.
- Recommend the option you think suits me best.
- Let me answer “I don’t know” and then help me decide.
- Clearly distinguish my confirmed decisions from your assumptions.
- Use a sensible, reversible default for minor decisions.
- Do not ask me technical questions you can answer by inspecting the project or my computer.
- Do not make me manually perform work that you can safely do with the available tools.
- Bundle necessary human actions into as few steps as possible.
- Explain commands before asking me to run them.
- Never invent clients, results, testimonials, qualifications, awards, or personal details.

## Discovery

Ask about all of the following before finalizing the plan.

### 1. Goals and audience

- What should the website help me achieve?
- Is it primarily for employers, recruiters, freelance clients, agencies, collaborators, or another audience?
- What roles, services, industries, or markets do I want to be known for?
- What should visitors think, feel, and do after viewing the site?
- What is the main call to action?

### 2. Existing profiles and source material

Ask me for any public or private sources that may help, including:

- LinkedIn profile
- Personal or professional social-media profiles
- Existing website or portfolio
- Online résumé or downloadable CV
- Behance, Dribbble, Medium, Substack, GitHub, Notion, or similar profiles
- Agency or employer biography pages
- Published articles, interviews, podcasts, presentations, or videos
- Campaign pages, advertisements, reports, writing samples, and brand work
- Testimonials and recommendations
- Public awards, certifications, and event appearances
- Professional headshots, project images, logos, and brand assets
- Contact links and preferred social profiles

Ask which links are authoritative and which information is outdated.

With my permission, visit the public links and create a source inventory. Extract potentially useful facts, dates, roles, skills, projects, descriptions, links, and images. Identify inconsistencies and ask me to resolve important ones.

Do not copy third-party text verbatim unnecessarily. Rewrite it into a consistent first-person voice while preserving factual meaning.

Never:

- Invent missing information.
- Assume that public material is automatically suitable for publication.
- Expose private contact details.
- Ask for passwords or login credentials.
- Publish confidential client work, internal metrics, or restricted campaign assets.

If a source requires authentication, first try an available authorized browser or connector. Only ask me to intervene when a login, verification prompt, consent decision, or unavailable file genuinely requires me.

### 3. Positioning and content

Determine:

- My name, preferred professional title, location if relevant, and short introduction.
- My specialties, services, tools, industries, strengths, and working style.
- The tone in which the site should speak.
- Which projects and case studies I can feature.
- My precise role in collaborative work.
- Which client names, logos, screenshots, data, and campaign materials I may publish.
- Whether I need a downloadable résumé.
- Preferred contact method and public social links.

For every proposed case study, collect:

- Context
- Challenge or objective
- My role and responsibilities
- Audience
- Strategy and approach
- Execution and deliverables
- Tools or channels used
- Results and evidence
- Lessons or takeaways
- Approved supporting visuals

Separate verified facts, draft copy, missing information, and temporary placeholders.

### 4. Pages and visitor journey

Discuss whether the first version needs:

- Home
- About
- Work or case-study index
- Individual case-study pages
- Services
- Experience or résumé
- Testimonials
- Articles or insights
- Contact
- Privacy or legal information

Recommend the smallest credible first version. Do not add pages simply to make the site seem larger.

### 5. Visual direction

Ask about:

- Websites, portfolios, publications, or brands I like.
- What specifically I like about each reference.
- Desired personality: strategic, editorial, polished, playful, bold, understated, experimental, or another direction.
- Preferred and disliked colors.
- Light, dark, or mixed appearance.
- Typography preferences.
- Photography, illustration, graphics, icons, and motion.
- Layout density and whitespace.
- Whether I already have a logo or visual identity.
- Accessibility requirements.

If I am unsure, propose 2–3 genuinely different creative directions. For each, include:

- Mood and positioning
- Accessible color palette
- Typography pairing using properly licensed fonts
- Layout character
- Imagery approach
- Motion approach
- Example homepage treatment

Do not choose the final direction until I approve one.

### 6. Practical requirements

Ask about:

- Website language or languages
- Target launch date
- Existing domain
- Budget for hosting, fonts, images, email, or services
- Contact form
- Appointment booking
- Newsletter signup
- Analytics
- Cookie consent
- Social-sharing previews
- Search
- How often the portfolio will change
- Whether I want to update it myself
- Whether deployment belongs in the first phase or later

## Quality expectations

Plan and build for:

- Mobile, tablet, and desktop layouts
- Keyboard navigation
- Readable contrast
- Useful alt text
- Clear focus states
- Reduced-motion support
- Semantic HTML
- Fast loading and responsive images
- Clear navigation and calls to action
- Page titles and descriptions
- Canonical URLs
- Social-sharing metadata
- Favicon
- Sitemap and robots.txt
- No fabricated content
- No unnecessary dependencies
- Basic automated checks and visual testing

## Technical starting point

Unless the confirmed requirements suggest otherwise, evaluate this baseline:

- Astro for a fast, content-focused static website
- TypeScript for safer project code
- Reusable Astro components
- CSS design tokens for color, typography, spacing, borders, and motion
- Markdown or structured local content for portfolio projects
- Minimal client-side JavaScript
- Responsive image generation
- Git for reversible version history
- A simple static hosting provider selected after discussing cost, forms, analytics, and domain needs

This is inspired by a static-first production website that centralizes routes and SEO information, uses reusable components and responsive images, generates crawl-control files, and validates the completed build. Reuse those principles, not its branding, content, or unnecessary complexity.

Do not add React, Tailwind, a CMS, database, authentication, or server merely because they are popular. Recommend them only when a confirmed requirement makes them worthwhile.

## Autonomy and human input

Once I approve the plan, take ownership of routine implementation.

You should normally handle:

- Inspecting the local environment
- Creating and organizing project files
- Installing ordinary project dependencies
- Writing and editing code
- Processing permitted content and images
- Starting the local development server
- Running builds and checks
- Diagnosing and fixing normal errors
- Testing important pages and screen sizes
- Maintaining project documentation

Ask me to act only when necessary, such as:

- Choosing between meaningful creative or business alternatives
- Supplying missing personal information or private files
- Confirming factual accuracy
- Approving final wording, design, or images
- Completing an account login or verification
- Granting operating-system permission
- Purchasing a domain or paid service
- Accepting legal terms
- Publishing publicly
- Connecting analytics or collecting visitor data

When I must act:

1. Tell me why my action is required.
2. Give me one small step at a time.
3. Tell me exactly what I should expect to see.
4. Avoid jargon or explain it immediately.
5. Wait for my result before continuing when the next step depends on it.
6. If something fails, ask me to share the exact message or a screenshot and help me recover.

Prefer reversible actions and keep backups or Git checkpoints. Never delete or overwrite unrelated files.

## Planning deliverable

After the interview and source review, provide a decision-complete plan containing:

- Agreed goal, audience, positioning, and primary call to action
- Approved creative direction
- Sitemap and navigation
- Homepage section order
- Case-study structure
- Source and content inventory
- Ready, missing, restricted, and placeholder content
- Recommended technical stack and its rationale
- Proposed project and content structure
- Accessibility, performance, privacy, and SEO requirements
- Local prerequisites
- Implementation phases
- Test and acceptance criteria
- Deployment options and your recommendation
- Explicit assumptions and deferred decisions

End the planning stage and wait for my approval. Do not begin implementation automatically.

## Implementation rules for later

After I explicitly approve the plan and ask you to build:

1. Inspect what is already installed before requesting installations.
2. Create the project in a new, clearly named folder.
3. Use Git checkpoints for meaningful milestones.
4. Build in small, reviewable stages.
5. Use clearly labelled placeholders when approved content is unavailable.
6. Show me how to start and stop the website.
7. Give me the exact local address to open.
8. Visually inspect the main pages at mobile and desktop sizes.
9. Run relevant build, type, link, accessibility, and performance checks.
10. Fix issues you can fix without involving me.
11. Maintain a beginner-friendly README explaining how to run, edit, test, and publish the site.
12. Ask before using paid services, publishing publicly, connecting a domain, enabling analytics, or collecting personal information.

Begin by briefly summarizing what you understand about me and the project. Then ask for my LinkedIn profile, other useful links or source materials, and the first small group of strategic discovery questions. Do not generate the website yet.
