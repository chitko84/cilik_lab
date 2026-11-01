/** Additional fictional records for the local-only CilikLab Operator demonstration. */
export type DemoPerson = { id:string; name:string; details:string; status:string; category:string; owner:string; date:string };

const studentRows: [string,string,string,string,string,string][] = [
  ['s6','Adam Faris','Level 1 · 4 lessons finished','Active','Python Explorer','Ms. Hana'],
  ['s7','Sofia Iskandar','Level 3 · 19 lessons finished','Active','Code Adventurer','Mr. Razak'],
  ['s8','Arjun Nair','Level 2 · 13 lessons finished','Active','RoboLab Explorer','Mr. Razak'],
  ['s9','Nur Alya','Level 4 · 26 lessons finished','Active','Young Developer','Ms. Hana'],
  ['s10','Ethan Wong','Level 1 · 5 lessons finished','Pending','New Learner','Ms. Nur'],
  ['s11','Aisha Rahman','Level 3 · 21 lessons finished','Active','Python Explorer','Ms. Hana'],
  ['s12','Lucas Tan','Level 2 · 15 lessons finished','Active','Coding Club','Mr. Daniel'],
  ['s13','Farah Iman','Level 5 · 34 lessons finished','Active','Young Developer','Ms. Nur'],
  ['s14','Harith Hakim','Level 1 · 3 lessons finished','Active','New Learner','Ms. Hana'],
  ['s15','Chloe Lim','Level 3 · 20 lessons finished','Active','Code Adventurer','Mr. Daniel'],
  ['s16','Rohan Patel','Level 2 · 12 lessons finished','Paused','RoboLab Explorer','Mr. Razak'],
  ['s17','Nur Damia','Level 4 · 30 lessons finished','Active','Young Developer','Ms. Nur'],
  ['s18','Amir Danish','Level 1 · 7 lessons finished','Active','Python Explorer','Ms. Hana'],
  ['s19','Olivia Lee','Level 2 · 11 lessons finished','Active','Coding Club','Mr. Daniel'],
  ['s20','Ismail Yusuf','Level 3 · 24 lessons finished','Pending','Code Adventurer','Mr. Razak'],
  ['s21','Priya Menon','Level 4 · 29 lessons finished','Active','Young Developer','Ms. Nur'],
  ['s22','Zara Sofea','Level 2 · 16 lessons finished','Active','Python Explorer','Ms. Hana'],
  ['s23','Jayden Chan','Level 5 · 36 lessons finished','Active','RoboLab Explorer','Mr. Razak'],
  ['s24','Hannah Ong','Level 1 · 2 lessons finished','Pending','New Learner','Ms. Hana'],
  ['s25','Muhammad Irfan','Level 3 · 18 lessons finished','Active','Coding Club','Mr. Daniel'],
  ['s26','Anika Sharma','Level 4 · 31 lessons finished','Active','Code Adventurer','Ms. Nur'],
  ['s27','Isaac Low','Level 2 · 10 lessons finished','Active','RoboLab Explorer','Mr. Razak'],
  ['s28','Puteri Balqis','Level 1 · 6 lessons finished','Active','New Learner','Ms. Hana'],
  ['s29','Ryan Goh','Level 3 · 23 lessons finished','Active','Python Explorer','Mr. Daniel'],
  ['s30','Maryam Zain','Level 2 · 14 lessons finished','Active','Coding Club','Ms. Hana'],
  ['s31','Kavya Iyer','Level 5 · 38 lessons finished','Active','Young Developer','Ms. Nur'],
  ['s32','Danial Azri','Level 1 · 1 lesson finished','Paused','New Learner','Mr. Daniel'],
];

const teacherRows: [string,string,string,string,string,string][] = [
  ['t5','Siti Aisyah','Creative Python projects and storytelling','Active','Programming','CilikLab'],
  ['t6','Amirul Hakim','Introductory C and algorithms','Active','Programming','CilikLab'],
  ['t7','Priya Nair','Java fundamentals and problem solving','Active','Programming','CilikLab'],
  ['t8','Farhan Idris','3D robotics and automation','Active','Robotics','CilikLab'],
  ['t9','Grace Wong','Game-based logic and coding','Active','Computational Thinking','CilikLab'],
  ['t10','Aiman Yusuf','Python projects for early learners','Pending','Programming','CilikLab'],
  ['t11','Kavitha Rao','Data structures for young coders','Active','Programming','CilikLab'],
  ['t12','Michelle Tan','Scratch-to-Python bridging lessons','Active','Computational Thinking','CilikLab'],
  ['t13','Hakim Zulkarnain','Robot sensors and simulations','Active','Robotics','CilikLab'],
  ['t14','Sabrina Lee','Coding workshops and learner support','Active','Student Support','CilikLab'],
];
const row = (r: [string,string,string,string,string,string]): DemoPerson => ({
  id:r[0], name:r[1], details:r[2], status:r[3], category:r[4], owner:r[5], date:'01 Nov 2026',
});
export const additionalStudents: DemoPerson[] = studentRows.map(row);
export const additionalTeachers: DemoPerson[] = teacherRows.map(row);
