export type LocalText = { ms: string; en: string };
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Point = { x: number; y: number };
export const VECTORS: Record<Direction, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
export type MazeLevel = { id: string; name: LocalText; topic: LocalText; map: string[]; tip: LocalText };

// S = start, D = exit door, * = stars, # = solid wall, . = walkable tile.
// Each stage is intentionally hand-designed so every star and the door are reachable.
export const MAZE_LEVELS: MazeLevel[] = [
  { id:'maze-1',name:{ms:'Langkah Pertama',en:'First Steps'},topic:{ms:'Arah pergerakan',en:'Movement directions'},map:['#########','#S..*..D#','#########'],tip:{ms:'Pergi ke kanan untuk mencari pintu!',en:'Go right to find the door!'} },
  { id:'maze-2',name:{ms:'Selekoh Pintar',en:'The Clever Turn'},topic:{ms:'Rancang laluan',en:'Plan your route'},map:['#########','#S.*#..D#','#...#...#','###...###','#########'],tip:{ms:'Ada dinding di tengah. Cuba pergi ke bawah dahulu.',en:'A wall blocks the middle. Try going down first.'} },
  { id:'maze-3',name:{ms:'Jejak Bintang',en:'Star Trail'},topic:{ms:'Pilihan dan arah',en:'Choices and directions'},map:['#########','#S..#..D#','#.#.#.#.#','#...*...#','#########'],tip:{ms:'Cari laluan melalui baris paling bawah.',en:'Find your way through the lowest open row.'} },
  { id:'maze-4',name:{ms:'Jambatan Pelangi',en:'Rainbow Bridge'},topic:{ms:'Merancang langkah',en:'Planning steps'},map:['#########','#S..*...#','#.#####.#','#...*...#','###.###.#','#......D#','#########'],tip:{ms:'Dapatkan kedua-dua bintang sebelum keluar.',en:'Try to collect both stars before leaving.'} },
  { id:'maze-5',name:{ms:'Terowong Robot',en:'Robot Tunnels'},topic:{ms:'Penyelesaian masalah',en:'Problem solving'},map:['###########','#S...#...D#','#.#.#.#.#.#','#.#...#...#','#.###.#.#.#','#.....*...#','###########'],tip:{ms:'Perhatikan laluan yang menghubungkan dua kawasan.',en:'Look for the route connecting the two areas.'} },
  { id:'maze-6',name:{ms:'Misi Akhir',en:'Final Mission'},topic:{ms:'Strategi labirin',en:'Maze strategy'},map:['###########','#S.*...#..#','#.###.#.#.#','#...#.#...#','###.#.###.#','#...*...#D#','#.#######.#','#.........#','###########'],tip:{ms:'Gunakan laluan berpusing untuk membuka jalan ke pintu.',en:'Take the winding route to reach the door.'} },
];

export const ESCAPE_LEVELS: MazeLevel[] = [
  { id:'escape-1',name:{ms:'Kod Pertama',en:'Your First Code'},topic:{ms:'Arahan mudah',en:'Simple commands'},map:['########','#S...D##','########'],tip:{ms:'Cuba move_right() empat kali.',en:'Try move_right() four times.'} },
  { id:'escape-2',name:{ms:'Pusing Sudut',en:'Turn the Corner'},topic:{ms:'Urutan arahan',en:'Sequence of commands'},map:['########','#S..####','###.####','###...D#','########'],tip:{ms:'Gerak ke kanan, ke bawah, kemudian ke kanan lagi.',en:'Move right, then down, then right again.'} },
  { id:'escape-3',name:{ms:'Kuasa Gelung',en:'Loop Power'},topic:{ms:'for dan range',en:'for and range'},map:['#########','#S.*...D#','#########'],tip:{ms:'Gunakan for i in range(6): dan move_right().',en:'Use for i in range(6): with move_right().'} },
  { id:'escape-4',name:{ms:'Pintu Rahsia',en:'Secret Door'},topic:{ms:'Gabung arah dan gelung',en:'Combine directions and loops'},map:['#########','#S...####','####.####','####.*.D#','#########'],tip:{ms:'Ulang pergerakan kanan, kemudian turun dua kali.',en:'Repeat right movements, then move down twice.'} },
  { id:'escape-5',name:{ms:'Cabaran Bintang',en:'Star Challenge'},topic:{ms:'Algoritma dan susunan',en:'Algorithms and sequencing'},map:['#########','#S.*#..D#','#...#...#','###.*.###','#########'],tip:{ms:'Cari jalan di bawah halangan tengah.',en:'Find a route beneath the central obstacle.'} },
  { id:'escape-6',name:{ms:'Kod Juara',en:'Champion Code'},topic:{ms:'Rancang dan uji kod',en:'Plan and test code'},map:['###########','#S...#...D#','#.#.#.#.#.#','#.#...#...#','#.###.#.#.#','#...*.....#','###########'],tip:{ms:'Mulakan dengan laluan ke bawah. Gunakan gelung jika sesuai.',en:'Start by navigating down. Use loops where helpful.'} },
];

export type DetectiveCase = { id: string; code: string; question: LocalText; options: LocalText[]; answer: number; reason: LocalText; tip: LocalText };
export const DETECTIVE_CASES: DetectiveCase[] = [
  {id:'bug-1',code:'nama = "Ali"\nprint(nma)',question:{ms:'Kenapa nama tidak dijumpai?',en:'Why can’t Python find the name?'},options:[{ms:'Tukar kepada print(nama)',en:'Change to print(nama)'},{ms:'Tambah tanda tambah',en:'Add a plus sign'},{ms:'Buang print',en:'Remove print'}],answer:0,reason:{ms:'Nama pemboleh ubah mesti dieja sama: nama.',en:'The variable name must be spelled consistently: nama.'},tip:{ms:'Lihat ejaan dalam dua baris.',en:'Compare the spelling on both lines.'}},
  {id:'bug-2',code:'for i in range(3)\n    print(i)',question:{ms:'Apa yang tertinggal pada baris pertama?',en:'What is missing on line one?'},options:[{ms:'Titik bertindih (:)',en:'A colon (:)'},{ms:'Tanda soal (?)',en:'A question mark (?)'},{ms:'Tanda tambah (+)',en:'A plus sign (+)'}],answer:0,reason:{ms:'Gelung for mesti diikuti titik bertindih.',en:'A for loop header needs a colon.'},tip:{ms:'Periksa hujung arahan for.',en:'Check the end of the for statement.'}},
  {id:'bug-3',code:'umur = 10\nif umur = 10:\n    print("Sama")',question:{ms:'Simbol mana membandingkan dua nilai?',en:'Which symbol compares two values?'},options:[{ms:'!=',en:'!='},{ms:'==',en:'=='},{ms:'+=',en:'+='}],answer:1,reason:{ms:'== membandingkan nilai, = menetapkan nilai.',en:'== compares values; = assigns values.'},tip:{ms:'Python menggunakan dua tanda sama dengan untuk perbandingan.',en:'Python uses two equal signs for comparison.'}},
  {id:'bug-4',code:'markah = 8\nprint("Markah: " + markah)',question:{ms:'Kenapa teks dan nombor tidak boleh ditambah begini?',en:'Why can’t this text and number be added?'},options:[{ms:'Gunakan str(markah)',en:'Use str(markah)'},{ms:'Gunakan int("Markah")',en:'Use int("Markah")'},{ms:'Padam markah',en:'Delete markah'}],answer:0,reason:{ms:'str() menukar nombor kepada teks supaya boleh dicantumkan.',en:'str() converts a number to text before joining strings.'},tip:{ms:'Jenis data markah ialah nombor.',en:'The value of markah is a number.'}},
  {id:'bug-5',code:'buah = ["epal", "pisang"]\nprint(buah[2])',question:{ms:'Kenapa indeks 2 menyebabkan ralat?',en:'Why does index 2 cause an error?'},options:[{ms:'Senarai bermula pada 0',en:'List indices start at 0'},{ms:'Senarai hanya untuk nombor',en:'Lists only hold numbers'},{ms:'print tidak boleh baca senarai',en:'print cannot read lists'}],answer:0,reason:{ms:'Senarai ini mempunyai indeks 0 dan 1 sahaja.',en:'This list only contains indices 0 and 1.'},tip:{ms:'Kira dari 0, bukan 1.',en:'Count from 0, not 1.'}},
  {id:'bug-6',code:'if True:\nprint("Helo")',question:{ms:'Apa yang perlu dilakukan pada baris kedua?',en:'What should change on the second line?'},options:[{ms:'Indenkan print',en:'Indent print'},{ms:'Padam titik bertindih',en:'Remove the colon'},{ms:'Guna huruf kecil true',en:'Use lowercase true'}],answer:0,reason:{ms:'Arahan di dalam if perlu diindenkan.',en:'Statements inside an if block must be indented.'},tip:{ms:'Perhatikan ruang di awal baris.',en:'Look at spaces at the start of the line.'}},
  {id:'bug-7',code:'jumlah = 12\njumlah = jumlah / 0\nprint(jumlah)',question:{ms:'Apa yang menyebabkan program berhenti?',en:'What makes the program stop?'},options:[{ms:'Tidak boleh bahagi dengan sifar',en:'You cannot divide by zero'},{ms:'12 terlalu besar',en:'12 is too large'},{ms:'print perlu dibuang',en:'Remove print'}],answer:0,reason:{ms:'Pembahagian dengan sifar menyebabkan ZeroDivisionError.',en:'Division by zero raises ZeroDivisionError.'},tip:{ms:'Lihat penyebut operasi bahagi.',en:'Look at the denominator in the division.'}},
  {id:'bug-8',code:'warna = "biru"\nif warna == "merah":\n    print("Merah")\nelse\n    print("Lain")',question:{ms:'Apa yang tertinggal selepas else?',en:'What is missing after else?'},options:[{ms:'Tanda koma (,)',en:'A comma (,)'},{ms:'Titik bertindih (:)',en:'A colon (:)'},{ms:'Tanda sama (=)',en:'An equal sign (=)'}],answer:1,reason:{ms:'else: mesti berakhir dengan titik bertindih.',en:'else: must end with a colon.'},tip:{ms:'Bandingkan dengan hujung baris if.',en:'Compare it with the end of the if line.'}},
];

export type LogicLevel = { id: string; question: LocalText; lines: string[]; shuffled: number[]; reason: LocalText; hint: LocalText };
export const LOGIC_LEVELS: LogicLevel[] = [
  {id:'logic-1',question:{ms:'Simpan dan papar nama.',en:'Save and print a name.'},lines:['nama = "Ali"','print(nama)'],shuffled:[1,0],reason:{ms:'Simpan nama sebelum mencetak.',en:'Save the name before printing.'},hint:{ms:'Data perlu wujud sebelum digunakan.',en:'Data must exist before it is used.'}},
  {id:'logic-2',question:{ms:'Papar mesej tiga kali.',en:'Show a message three times.'},lines:['for i in range(3):','    print("Helo!")'],shuffled:[1,0],reason:{ms:'Gelung diperkenalkan sebelum arahan berinden.',en:'Introduce the loop before its indented body.'},hint:{ms:'Cari baris yang berakhir dengan titik bertindih.',en:'Find the line ending with a colon.'}},
  {id:'logic-3',question:{ms:'Semak markah dan beri tahniah.',en:'Check the score and celebrate.'},lines:['score = 5','if score >= 5:','    print("Hebat!")'],shuffled:[2,0,1],reason:{ms:'Tetapkan nilai, semak syarat, kemudian papar hasil.',en:'Assign the value, check the condition, then show the result.'},hint:{ms:'Baris yang menentukan score mesti dahulu.',en:'The line setting score should go first.'}},
  {id:'logic-4',question:{ms:'Kira jumlah dua nombor.',en:'Add two numbers together.'},lines:['a = 4','b = a + 3','jumlah = b * 2','print(jumlah)'],shuffled:[3,2,1,0],reason:{ms:'Nilai a dan b perlu ditetapkan sebelum dikira.',en:'Set a and b before calculating their sum.'},hint:{ms:'Tetapkan pemboleh ubah sebelum digunakan dalam pengiraan.',en:'Assign the variables before using them in a calculation.'}},
  {id:'logic-5',question:{ms:'Bina senarai dan baca item pertama.',en:'Make a list and read its first item.'},lines:['buah = ["epal", "mangga"]','pertama = buah[0]','print(pertama)'],shuffled:[2,0,1],reason:{ms:'Cipta senarai, baca item, kemudian cetak.',en:'Create the list, access the item, then print it.'},hint:{ms:'Senarai buah mesti dicipta dahulu.',en:'The buah list must be created first.'}},
  {id:'logic-6',question:{ms:'Sambut pengguna mengikut nama.',en:'Greet a user by name.'},lines:['nama = "Siti"','mesej = "Hai " + nama','print(mesej)'],shuffled:[1,2,0],reason:{ms:'Sediakan nama sebelum membina mesej.',en:'Prepare the name before constructing the message.'},hint:{ms:'Pemboleh ubah nama digunakan dalam baris kedua.',en:'The variable nama is used in the second line.'}},
  {id:'logic-7',question:{ms:'Jumlahkan nombor dengan gelung.',en:'Add numbers using a loop.'},lines:['jumlah = 0','for n in range(3):','    jumlah = jumlah + n','print(jumlah)'],shuffled:[3,1,0,2],reason:{ms:'Mulakan jumlah, ulang pengiraan, kemudian cetak hasil.',en:'Initialize the total, loop through additions, then print it.'},hint:{ms:'Nilai jumlah mesti bermula pada 0 sebelum gelung.',en:'The total should start at 0 before the loop.'}},
  {id:'logic-8',question:{ms:'Semak umur dengan if dan else.',en:'Check age with if and else.'},lines:['umur = 12','if umur >= 12:','    print("Boleh masuk")','else:','    print("Belum boleh")'],shuffled:[4,2,3,0,1],reason:{ms:'Tetapkan umur, kemudian susun if dan else bersama blok masing-masing.',en:'Set age, then place if and else with their respective blocks.'},hint:{ms:'else datang selepas arahan di dalam if.',en:'else comes after the body of if.'}},
];

export function parseMaze(level: MazeLevel) {
  const height = level.map.length; const width = level.map[0]?.length ?? 0;
  if (!width || level.map.some(row => row.length !== width)) throw new Error(`Invalid map dimensions: ${level.id}`);
  let start: Point | null = null, door: Point | null = null; const stars: string[] = [];
  level.map.forEach((row,y) => [...row].forEach((cell,x) => {if(cell==='S') start={x,y};if(cell==='D') door={x,y};if(cell==='*') stars.push(`${x},${y}`)}));
  if(!start||!door) throw new Error(`Missing S or D in ${level.id}`);
  return {width,height,start:start as Point,door:door as Point,stars};
}
export function isOpen(level: MazeLevel, position: Point) { return !!level.map[position.y]?.[position.x] && level.map[position.y][position.x] !== '#'; }
export function shortestPath(level: MazeLevel, from: Point, destination: Point): Direction[] | null {
  const queue: {p:Point;path:Direction[]}[] = [{p:from,path:[]}]; const seen=new Set<string>([`${from.x},${from.y}`]);
  for(let head=0; head<queue.length; head++) { const {p,path}=queue[head];if(p.x===destination.x&&p.y===destination.y)return path;
    for(const dir of ['right','down','left','up'] as Direction[]) { const v=VECTORS[dir];const next={x:p.x+v.x,y:p.y+v.y};const key=`${next.x},${next.y}`;
      if(isOpen(level,next)&&!seen.has(key)){seen.add(key);queue.push({p:next,path:[...path,dir]});}
    }
  } return null;
}
