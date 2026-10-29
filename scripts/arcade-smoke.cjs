/** Run with `npm run test:arcade` after `npm install`. No browser required. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = function (mod, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;
  mod._compile(compiled,filename);
};
const {MAZE_LEVELS,ESCAPE_LEVELS,DETECTIVE_CASES,LOGIC_LEVELS,parseMaze,shortestPath} = require('../src/pages/arcade/arcadeData.ts');
const {compileMazeCommands,CommandError} = require('../src/services/arcadeCommandRunner.ts');
const {simulateMazeCode,mazeScore} = require('../src/services/arcadeRules.ts');
const all=[...MAZE_LEVELS,...ESCAPE_LEVELS];
assert.equal(MAZE_LEVELS.length,6);
assert.equal(ESCAPE_LEVELS.length,6);
assert.equal(DETECTIVE_CASES.length,8);
assert.equal(LOGIC_LEVELS.length,8);
assert.equal(new Set([...all,...DETECTIVE_CASES,...LOGIC_LEVELS].map(x=>x.id)).size,28);
for(const level of all){
  const meta=parseMaze(level);
  for(const goal of [meta.door,...meta.stars.map(s=>{const [x,y]=s.split(',').map(Number);return {x,y}})]){
    assert.ok(shortestPath(level,meta.start,goal),level.id+' unreachable tile '+JSON.stringify(goal));
  }
  const route=shortestPath(level,meta.start,meta.door);
  const script=route.map(direction=>`move_${direction}()`).join('\n');
  const frames=simulateMazeCode(level,compileMazeCommands(script));
  assert.equal(frames.at(-1).won,true,level.id+' does not open door');
  assert.ok(mazeScore(meta.stars.length,route.length,true)>=100);
}
for(const puzzle of LOGIC_LEVELS){assert.equal(puzzle.shuffled.length,puzzle.lines.length);assert.deepEqual([...puzzle.shuffled].sort((a,b)=>a-b),puzzle.lines.map((_,i)=>i));}
for(const task of DETECTIVE_CASES){assert.ok(task.answer>=0&&task.answer<task.options.length);}
assert.equal(compileMazeCommands('for i in range(3):\n    move_right()').length,3);
assert.equal(compileMazeCommands('for i in range(2):\n    for j in range(3):\n        move_down()').length,6);
for(const source of ['import os','while True:\n    move_left()','move_right(); alert(1)','for i in range(100):\n    move_up()','for i in range(3):\nmove_right()']){
  assert.throws(()=>compileMazeCommands(source),CommandError);
}
console.log('PASS: 4 games, 28 levels, 12 solvable maze maps, scoring, and restricted command validation.');
