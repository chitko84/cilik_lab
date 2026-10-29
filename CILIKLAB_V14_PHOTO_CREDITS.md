# CilikLab v14 — Real photography and motion-only refresh

This update **does not add new pages, games, activities, scoring rules or progress keys**. All existing click actions remain connected to the original app.

## Genuine photographs — Unsplash free license

The website displays original photography from Unsplash, sourced from individual **free-to-use** photographs, not Unsplash+ photos. The original photo pages:

| Role in CilikLab | Photographer | Unsplash source |
|---|---|---|
| Child studying with a laptop (landing hero) | Vitaly Gariev | https://unsplash.com/photos/young-boy-learning-on-a-laptop-at-a-desk-5jeHKPNLdLY |
| Computer classroom (learning and collaboration) | Gaurav Tiwari | https://unsplash.com/photos/students-and-teacher-in-a-computer-classroom-lKxSeXSrKlM |
| Young learner with headphones (lessons) | Thomas Park | https://unsplash.com/photos/a-little-girl-sitting-at-a-table-with-a-laptop-w9i7wMaM3EE |
| Students collaborating with laptops (dashboard) | Vitaly Gariev | https://unsplash.com/photos/diverse-group-of-students-gathered-around-a-laptop-EA0-iajPYFE |
| Educator assisting students at computers (teacher pages) | Poddar Group of Institutions | https://unsplash.com/photos/teacher-guiding-students-on-computer-in-classroom-ereEoYDIl20 |

License: https://unsplash.com/license (commercial/non-commercial use generally free; photo credit appreciated).

**Important**: The images are fetched from `images.unsplash.com` at runtime. The available build environment could not download original photo files for bundling, so a **locally bundled illustration fallback** appears automatically if remote photos fail to load. Pages and buttons work offline, but viewing genuine photographs requires internet access to the photo CDN. These are illustrative stock images, not photographs of actual CilikLab students or a real CilikLab classroom. As with all images featuring identifiable people, review any additional publicity/consent requirements before commercial publication.

## Visual changes

- Real-image hero on the landing page, new inset Ciko graphic and gentle floating details.
- Two-image learning photo strip on the landing page.
- Real-photo student/teacher dashboard banners with readable gradient overlays.
- Real classroom imagery on class discovery and coding/lessons ribbons.
- New student discovery ribbon leading to existing Explore Classes.
- Scroll reveal effects on page sections using `IntersectionObserver`; always shown when unsupported.
- Subtle animations on hero details, photo framing, cards and buttons.
- Better shadows, contrast, responsiveness and focus treatment.
- All nonessential animations respect `prefers-reduced-motion`.
- No new npm packages.

## Windows verification

```powershell
npm install
npm run test:site
npm run test:arcade:all
npm run build
npm run dev
```

Manually review landing, student dashboard, teacher dashboard, Explore Classes, Lessons, Coding Workspace, Comics, Arcade and Mobile navigation. Confirm photos render with internet, local artwork fallback works offline, cards still navigate, and reduced motion disables animations.
