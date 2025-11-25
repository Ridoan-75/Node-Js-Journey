=========================================================================================
              BUILDING A SIMPLE FILE ORGANIZER CLI (NODE.JS)
=========================================================================================

এই ডকুমেন্টে দেখানো হবে কিভাবে Node.js দিয়ে একটি **File Organizer CLI Tool** বানানো যায়,  
যা কোনো ফোল্ডারের সব ফাইলকে তাদের **extension অনুযায়ী** আলাদা সাব-ফোল্ডারে সাজিয়ে দেয়।

=========================================================================================
# 0. কী কী করতে পারবে এই CLI?
=========================================================================================
- Extension অনুযায়ী ফাইল sort  
- Category folder auto-create  
- Safe rename (conflict handle)  
- Simple synchronous structure  
- External package প্রয়োজন নেই  

=========================================================================================
# 1. প্রজেক্ট স্ট্রাকচার
=========================================================================================
file-organizer/  
│  
├── organizer.js  
└── README.md  

=========================================================================================
# 2. Extension → Category Mapping
=========================================================================================
images → jpg, jpeg, png, gif, webp  
videos → mp4, mkv, mov, avi  
documents → pdf, docx, txt, csv, xlsx  
musics → mp3, wav  
codes → js, ts, java, c, cpp, py  
archives → zip, rar, 7z  
others → সব অজানা extension  

=========================================================================================
# 3. Production Ready organizer.js
=========================================================================================


 //JAVASCRIPT HIGHLIGHTING ENABLED ✔

const fs = require("fs");
const path = require("path");

const TYPES = {
  images: ["jpg", "jpeg", "png", "gif", "webp"],
  videos: ["mp4", "mkv", "mov", "avi"],
  documents: ["pdf", "docx", "txt", "csv", "xlsx"],
  musics: ["mp3", "wav"],
  codes: ["js", "ts", "java", "c", "cpp", "py"],
  archives: ["zip", "rar", "7z"]
};

function getCategory(ext) {
  for (const type in TYPES) {
    if (TYPES[type].includes(ext)) return type;
  }
  return "others";
}

function moveFileSafely(oldPath, newPath) {
  if (!fs.existsSync(newPath)) {
    fs.renameSync(oldPath, newPath);
    return;
  }

  const dir = path.dirname(newPath);
  const ext = path.extname(newPath);
  const base = path.basename(newPath, ext);

  let counter = 1;
  let finalPath;

  do {
    finalPath = path.join(dir, `${base}_${counter}${ext}`);
    counter++;
  } while (fs.existsSync(finalPath));

  fs.renameSync(oldPath, finalPath);
}

(function () {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.log("❌ Usage: node organizer.js <folder-path>");
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.log("❌ Error: Folder not found!");
    process.exit(1);
  }

  const items = fs.readdirSync(inputPath);

  items.forEach((item) => {
    const oldPath = path.join(inputPath, item);
    const stats = fs.statSync(oldPath);

    if (!stats.isFile()) return;

    const ext = path.extname(item).slice(1).toLowerCase();
    const category = getCategory(ext);

    const categoryFolder = path.join(inputPath, category);
    if (!fs.existsSync(categoryFolder)) {
      fs.mkdirSync(categoryFolder);
    }

    const newPath = path.join(categoryFolder, item);
    moveFileSafely(oldPath, newPath);

    console.log(`✔ ${item} → ${category}/`);
  });

  console.log("\n🎉 All files organized successfully!");
})();



=========================================================================================
4. কিভাবে রান করবে?
=========================================================================================
1| Windows → node organizer.js C:\Users\YourName\Desktop\Test
2| Linux/Mac → node organizer.js /home/username/Downloads

=========================================================================================

=========================================================================================
                                THE END
=========================================================================================