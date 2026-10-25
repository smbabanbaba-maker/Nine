# NatureWorks Global Solutions Ltd.

A premium, responsive informational website for **NatureWorks Global Solutions Ltd.**, a sustainability organization based in Kano, Nigeria.

**Live code:** https://github.com/smbabanbaba-maker/Nine

## Website sections

- **Home**: editorial hero, core values and calls to action.
- **About**: organization overview, mission, vision and values.
- **Services**: environmental protection, waste management, plastic recycling, climate action, sustainable agriculture and community development.
- **Programmes**: women's empowerment, youth development and inclusion of persons with disabilities.
- **Projects**: interactive focus-area filters (not misrepresented as completed projects).
- **Impact**: evidence-led reporting framework, without invented statistics.
- **Partners**: collaboration opportunities.
- **FAQ**: expandable answers.
- **Contact**: validated enquiry form, an email draft action, and copy enquiry button.

## Hosting on GitHub Pages

1. Open **Settings** of this GitHub repository.
2. Select **Pages** in the sidebar.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/(root)** and save.
5. GitHub will display the URL when publishing finishes. Site files do not require a build step.

The page also runs directly from \`index.html\` or on any static host.

## Important launch checklist

- **Real contacts:** No verified NatureWorks telephone number or email address has been supplied. The enquiry form intentionally prepares an email draft **without a recipient**; the user must enter a verified email address manually. Connect a backend/form provider for true online submissions when the organization approves the receiving address.
- **Real projects:** The three displayed cards are clearly marked *focus areas*, not claims of completed projects. Replace with verified case studies and approved images when available.
- **Impact figures:** Publish only measured, dated, verifiable outcomes.
- **Photographs:** Placeholder editorial imagery loads remotely from Unsplash. These photos do **not** represent actual NatureWorks staff or operations. Replace with organization-approved photos and verify applicable usage terms for production.
- **Logo:** The current custom vector mark approximates the supplied logo concept; replace it with the official transparent brand asset if available.
- **Social links and domain:** Add only verified official channels and a confirmed domain.
- **Accessibility:** Test keyboard navigation, mobile menu, text scaling and assistive technologies before publication.

## Source structure

\`\`\`text
index.html
assets/
  styles.css
  app.js
  favicon.svg
README.md
\`\`\`

## Technology

Semantic HTML5, responsive CSS, small vanilla JavaScript. No Node or framework build required. Includes responsive menu, interactive project filters, reveal effects, accessible focus states, reduced-motion handling, FAQ accordions, mobile layouts and search-engine metadata.

Review at narrow mobile (320/360/390px), tablet (768px) and desktop widths before production launch.


## Multi-page website navigation

Each top-level destination is a separate fast-loading HTML page, not a long page of anchor sections:

| Page | Location |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Services | `services.html` |
| Programmes | `programmes.html` |
| Projects | `projects.html` |
| Impact | `impact.html` |
| Partnerships | `partners.html` |
| Frequently Asked Questions | `faq.html` |
| Contact | `contact.html` |

The shared navigation works on both desktop and mobile. Previous hash-based deep links on Home redirect to the corresponding new page. Home retains the hero image slideshow and values statement; the other pages only contain their own subject-specific content, plus shared navigation/footer.

