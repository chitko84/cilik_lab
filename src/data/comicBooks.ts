export type ComicId = 'variables' | 'loops' | 'conditions';
export interface ComicPage {
  scene: 'home' | 'box' | 'market' | 'robot' | 'path' | 'door' | 'success';
  ms: { title: string; narration: string; speech: string; tip?: string };
  en: { title: string; narration: string; speech: string; tip?: string };
}
export interface ComicBook {
  id: ComicId;
  title: string;
  subtitle: string;
  titleEn: string;
  topic: string;
  color: string;
  pages: ComicPage[];
}
// Add links once the actual published flipbooks exist. Never display a dead link.
export const COMIC_FLIPBOOK_LINKS: Partial<Record<ComicId, string>> = {
  // variables: 'https://...'
};
export const COMICS: ComicBook[] = [
  { id: 'variables', title: 'Ali dan Kotak Ajaib', titleEn: 'Ali and the Magic Box', subtitle: 'Pemboleh Ubah / Variables', topic: 'Variables', color: 'from-sky-500 to-blue-700', pages: [
    {scene:'home',ms:{title:'Kotak yang misteri',narration:'Ali ingin menyimpan nama robot kesayangannya.',speech:'Bagaimana komputer boleh ingat nama? '},en:{title:'The mysterious box',narration:'Ali wants to save the name of his favourite robot.',speech:'How does a computer remember names?'}},
    {scene:'box',ms:{title:'Kotak bernama',narration:'Setiap pemboleh ubah seperti sebuah kotak yang mempunyai label.',speech:'Nama kotak ini ialah robot_name!',tip:'robot_name = "Ciko"'},en:{title:'A box with a name',narration:'A variable is like a box with a label.',speech:'This box is called robot_name!',tip:'robot_name = "Ciko"'}},
    {scene:'robot',ms:{title:'Kandungan kotak',narration:'Ali menyimpan nama Ciko dalam kotak itu.',speech:'Sekarang komputer ingat nama Ciko!',tip:'print(robot_name)'},en:{title:'Inside the box',narration:'Ali saves Ciko’s name in the box.',speech:'Now the computer remembers Ciko!',tip:'print(robot_name)'}},
    {scene:'success',ms:{title:'Cabaran Ali',narration:'Cuba cipta pemboleh ubah untuk menyimpan nama kamu sendiri.',speech:'Hebat! Kotak ajaib ialah pemboleh ubah!'},en:{title:'Ali’s challenge',narration:'Try creating a variable to store your own name.',speech:'Amazing! A variable is your magic box!'}}
  ]},
  { id: 'loops', title: 'Robot Cilik dan Gelung Masa', titleEn: 'Little Robot and the Time Loop', subtitle: 'Gelung / Loops', topic: 'Loops', color: 'from-violet-500 to-indigo-700', pages: [
    {scene:'robot',ms:{title:'Banyak kerja!',narration:'Ciko perlu mengambil tiga bintang di dalam taman.',speech:'Perlu ke saya tulis arahan tiga kali?'},en:{title:'So many jobs!',narration:'Ciko must collect three stars in the garden.',speech:'Do I need to write the same command three times?'}},
    {scene:'path',ms:{title:'Arahan berulang',narration:'Ali menunjukkan gelung for untuk mengulangi satu arahan.',speech:'Gunakan gelung, Ciko!',tip:'for i in range(3):'},en:{title:'Repeat a command',narration:'Ali shows Ciko a for loop to repeat a command.',speech:'Use a loop, Ciko!',tip:'for i in range(3):'}},
    {scene:'robot',ms:{title:'Satu, dua, tiga!',narration:'Ciko melangkah tiga kali dengan arahan yang sama.',speech:'Satu gelung, tiga langkah!',tip:'    print("Langkah")'},en:{title:'One, two, three!',narration:'Ciko takes three steps with the same instruction.',speech:'One loop, three steps!',tip:'    print("Step")'}},
    {scene:'success',ms:{title:'Cabaran Ciko',narration:'Bolehkah kamu buat gelung yang mengulang lima kali?',speech:'Gelung membantu kita mengelakkan kod berulang!'},en:{title:'Ciko’s challenge',narration:'Can you write a loop that repeats five times?',speech:'Loops help us avoid repeating code!'}}
  ]},
  { id: 'conditions', title: 'Rahsia Pintu Pintar', titleEn: 'The Secret Smart Door', subtitle: 'Syarat / Conditions', topic: 'Conditions', color: 'from-emerald-500 to-teal-700', pages: [
    {scene:'door',ms:{title:'Pintu misteri',narration:'Ali menjumpai pintu yang hanya terbuka dengan kod yang betul.',speech:'Bagaimana pintu ini membuat pilihan?'},en:{title:'A mysterious door',narration:'Ali finds a door that opens only with the right code.',speech:'How does this door make a choice?'}},
    {scene:'door',ms:{title:'Jika betul...',narration:'Python boleh menyemak sama ada syarat benar.',speech:'Jika kod betul, buka pintu!',tip:'if code == 1234:'},en:{title:'If it is correct...',narration:'Python checks whether a condition is true.',speech:'If the code is right, open the door!',tip:'if code == 1234:'}},
    {scene:'box',ms:{title:'Jika salah...',narration:'Jika syarat salah, else menentukan tindakan seterusnya.',speech:'Jika tidak, pintu kekal tertutup!',tip:'else:'},en:{title:'Otherwise...',narration:'When the condition is false, else picks the next action.',speech:'Otherwise, keep the door locked!',tip:'else:'}},
    {scene:'success',ms:{title:'Pintu terbuka!',narration:'Sekarang Ali faham bagaimana if dan else berfungsi.',speech:'Pilihan yang bijak bermula dengan syarat!'},en:{title:'The door opens!',narration:'Ali now understands how if and else work.',speech:'Smart choices start with conditions!'}}
  ]},
];
