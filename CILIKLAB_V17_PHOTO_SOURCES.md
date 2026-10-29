# CilikLab v17 — Photography Sources and Usage

This visual-only update uses real, existing Pexels photography instead of AI-generated classroom photography. Photos are loaded at runtime from `images.pexels.com` and **are not included as binaries in this ZIP**. The existing illustrations in `public/visuals` and `public/arcade` are included and are used if an external photo cannot load. The people pictured are stock-photo subjects, not CilikLab students or endorsers.

## Sources

| Component key | Pexels photo page | Contributor | Context |
| --- | --- | --- | --- |
| `childLearning` | https://www.pexels.com/photo/child-sitting-at-desk-with-tablet-4145041/ | Julia M Cameron | Child learning at home |
| `classTogether` | https://www.pexels.com/photo/a-children-looking-the-laptop-5212687/ | Max Fischer | Classroom collaboration |
| `youngLearner` | https://www.pexels.com/photo/boys-using-a-laptop-together-in-a-classroom-11025020/ | ROMAN ODINTSOV | Children working with a laptop |
| `collaboration` | https://www.pexels.com/photo/focused-multiethnic-schoolgirls-browsing-internet-on-laptop-while-studying-together-5896684/ | Mary Taylor | Children working together |
| `teacherGuidance` | https://www.pexels.com/photo/children-using-a-laptop-7742822/ | Alena Darmel | Teacher supervising learners |
| `codingTogether` | https://www.pexels.com/photo/young-boys-using-laptop-while-studying-11025029/ | ROMAN ODINTSOV | Coding and collaboration imagery |
| `studyGroup` | https://www.pexels.com/photo/students-studying-together-while-looking-at-the-screen-of-a-laptop-8199761/ | Yan Krukau | Group study |
| `learningAtHome` | https://www.pexels.com/photo/photo-of-a-child-doing-online-class-7014765/ | cottonbro studio | Child using laptop during online class |

Pexels license: https://www.pexels.com/license/ — photos can be used for personal and commercial projects for free, with attribution appreciated but not required, within the license terms. Stock subjects must not be falsely presented as endorsing CilikLab.

## Deployment considerations

- External images require an internet connection; the browser may block or fail to load images in some networks.
- Local illustrated fallbacks are used via the existing `RealPhoto` component's `onError` handler.
- On slow connections, prioritize the lightweight hero photo; other photos are lazy-loaded.
- Images are decorative/supportive. Buttons remain actual HTML buttons, and alternate text describes their editorial purpose.
- Do not imply that image subjects are current CilikLab users or that photos document real CilikLab events.
