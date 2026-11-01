/** Seeded history for CilikLab's browser-only Operator preview. No server events are represented. */
export type OperatorActivity = {
  id: string;
  action: string;
  when: string;
  category: 'Students' | 'Teachers' | 'Classes' | 'Schedules' | 'Content' | 'Support' | 'Moderation';
  actor: string;
  createdAt: string;
};

const learners = [
  'Aina Zulkifli', 'Ben Tan', 'Mei Ling', 'Ravi Kumar', 'Sarah Ahmad', 'Adam Faris',
  'Sofia Iskandar', 'Arjun Nair', 'Nur Alya', 'Ethan Wong', 'Aisha Rahman', 'Lucas Tan',
  'Farah Iman', 'Harith Hakim', 'Chloe Lim', 'Rohan Patel', 'Nur Damia', 'Amir Danish',
  'Olivia Lee', 'Ismail Yusuf', 'Priya Menon', 'Zara Sofea', 'Jayden Chan', 'Hannah Ong',
  'Muhammad Irfan', 'Anika Sharma', 'Isaac Low', 'Puteri Balqis', 'Ryan Goh', 'Maryam Zain',
  'Kavya Iyer', 'Danial Azri',
];
const educators = ['Hana Abdullah', 'Razak Mansor', 'Nur Izzah', 'Daniel Lim', 'Siti Aisyah',
  'Amirul Hakim', 'Priya Nair', 'Farhan Idris', 'Grace Wong', 'Aiman Yusuf',
  'Kavitha Rao', 'Michelle Tan', 'Hakim Zulkarnain', 'Sabrina Lee'];
const classrooms = ['Python Explorers', 'Young Robot Engineers', 'Coding Adventures', 'Java Jumpstart'];
const titles = ['Ciko and the Lost Loop', 'The Variable Treasure Hunt', 'If-Else in the Jungle',
  'The Function Factory', 'RoboLab 3D', 'Daily Coding Challenge'];
const actors:Record<OperatorActivity['category'],string> = {
  Students:'Enrollment Desk', Teachers:'Academic Coordinator', Classes:'Class Operations',
  Schedules:'Classroom Coordinator', Content:'Content Team', Support:'Support Desk',
  Moderation:'Community Team',
};
const categories:OperatorActivity['category'][] = [
  'Students','Classes','Teachers','Schedules','Students','Content','Support',
  'Classes','Moderation','Students','Teachers','Content','Support','Schedules',
];
/** Fixed fictional October–November 2026 events: stable across reloads and resets. */
export function createOperatorHistory(count=100):OperatorActivity[]{
  return Array.from({length:count},(_,index)=>{
    const category=categories[index%categories.length];
    const learner=learners[(index*7+3)%learners.length];
    const teacher=educators[(index*5+2)%educators.length];
    const classroom=classrooms[(index*3+1)%classrooms.length];
    const title=titles[(index*5+2)%titles.length];
    const iteration=Math.floor(index/categories.length);
    const offset=index%5;
    let action='';
    switch(category){
      case 'Students':
        action=[`${learner} enrolled in ${classroom}`,`${learner} completed an account profile review`,
          `${learner} moved to a new learning pathway`,`${learner}'s class registration was confirmed`,
          `${learner}'s learner progress summary was updated`][(iteration+offset)%5];
        break;
      case 'Teachers':
        action=[`Teacher profile reviewed: ${teacher}`,`Teaching schedule confirmed for ${teacher}`,
          `Class assignment updated for ${teacher}`,`Workshop availability reviewed: ${teacher}`][(iteration+offset)%4];
        break;
      case 'Classes':
        action=[`${classroom}: enrollment list updated`,`${classroom}: lesson plan reviewed`,
          `${classroom}: learner group confirmed`,`${classroom}: new session prepared`][(iteration+offset)%4];
        break;
      case 'Schedules':
        action=[`${classroom}: upcoming live session scheduled`,`${classroom}: meeting details adjusted`,
          `${classroom}: classroom calendar updated`,`${classroom}: session reminder prepared`][(iteration+offset)%4];
        break;
      case 'Content':
        action=[`Learning material reviewed: ${title}`,`Publication status checked: ${title}`,
          `Resource catalog updated for ${title}`,`Learning content details refreshed: ${title}`][(iteration+offset)%4];
        break;
      case 'Support':
        action=[`Enrollment assistance resolved for ${learner}`,`Coding editor question assigned for review`,
          `Classroom access request reviewed for ${learner}`,`RoboLab learning request marked complete`][(iteration+offset)%4];
        break;
      case 'Moderation':
        action=[`Community topic reviewed for classroom safety`,`Duplicate community post resolved`,
          `Learning discussion moderation completed`,`Reported post queued for review`][(iteration+offset)%4];
        break;
    }
    // Latest record is 01 Nov 2026, earlier records spread over the preceding month.
    const stamp=new Date(Date.UTC(2026,10,1,16,0) - index*7.15*3600_000);
    return {id:`history-${String(index+1).padStart(3,'0')}`,action,category,
      actor:actors[category],createdAt:stamp.toISOString(),
      when:stamp.toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'})};
  });
}
