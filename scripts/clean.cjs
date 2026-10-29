/* Cross-platform replacement for Unix-only rm -rf; safe for Windows PowerShell. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
for(const relative of ['dist','server.js']){
  const target=path.resolve(root,relative);
  if(path.dirname(target)!==root)throw new Error('Unsafe clean path');
  fs.rmSync(target,{recursive:true,force:true});
  console.log(`Cleaned ${relative}`);
}
