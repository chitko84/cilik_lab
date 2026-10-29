# CilikLab v27 — editorial photograph source notes

CilikLab v27 uses existing stock photos and seven **new real-life photographs**, all sourced from individual Pexels photo listings marked free to use. The existing 29 photographs remain in `PHOTO_LIBRARY`.

| Key | Subject used in CilikLab | Pexels photographer | Original source |
|---|---|---|---|
| `roboticsPartners` | Children collaborating on a robotics project with a laptop | Vanessa Loring | https://www.pexels.com/photo/focused-diverse-children-working-on-laptop-7869230/ |
| `mentoringMoment` | Teacher helping children with schoolwork | Katerina Holmes | https://www.pexels.com/photo/smart-kids-studying-with-teacher-in-classroom-5905921/ |
| `libraryMentor` | Teacher and child reading in a library | Mikhail Nilov | https://www.pexels.com/photo/teacher-showing-little-boy-book-in-library-8342417/ |
| `tabletClass` | Teacher leading a lesson with a digital tablet | Antoni Shkraba | https://www.pexels.com/photo/a-female-professor-teaching-her-students-5306431/ |
| `homeLearningDesk` | Student working on a school project at home | Ksenia Chernaya | https://www.pexels.com/photo/girl-doing-a-school-project-7695204/ |
| `readingCircle` | Teacher reading with pupils in a classroom | Thang Nguyen | https://www.pexels.com/photo/teacher-reading-to-engaged-students-in-classroom-36859095/ |
| `studyFriends` | Two students studying with tablet and textbooks | Vitaly Gariev | https://www.pexels.com/photo/teen-girls-studying-and-using-tablet-together-36812623/ |

License: https://www.pexels.com/license/ — photographs may be used for websites/apps without mandatory attribution under the Pexels License, subject to its conditions. This project does not imply that pictured people endorse or use CilikLab. Photographer credits are included voluntarily.

**Photo delivery:** the ZIP includes source URLs rather than downloaded photo binaries. Photos load from `images.pexels.com` in the browser. The existing `RealPhoto` component retains local illustration fallbacks for failed requests. Internet access is required to see Pexels images. Their CDN response was not independently tested in this build environment.

The visual changes do not modify the source license of original CilikLab illustrations, logos, or other content. For earlier images, see the existing v14/v17/v24/v26 photograph credit notes.
