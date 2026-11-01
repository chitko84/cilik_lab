/** Ciko RoboLab: 40 actual mission executions through the bounded Python teaching interpreter. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const ts=require('typescript');
const src=path.resolve(__dirname,'../src/pages/arcade/robolab');const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ciliklab-robolab-'));
try{
 for(const file of ['levels','engine','program']){
   const code=fs.readFileSync(path.join(src,file+'.ts'),'utf8');const js=ts.transpileModule(code,{fileName:file+'.ts',compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
   fs.writeFileSync(path.join(temp,file+'.js'),js);
 }
 const {ROBOLAB_LEVELS,shortestRoute}=require(path.join(temp,'levels.js'));
 const {runProgram}=require(path.join(temp,'program.js'));
 const {RobotEngine}=require(path.join(temp,'engine.js'));
 assert.equal(ROBOLAB_LEVELS.length,40,'40 missions must exist');
 assert.equal(new Set(ROBOLAB_LEVELS.map(l=>l.id)).size,40,'All IDs unique');
 assert.equal(new Set(ROBOLAB_LEVELS.map(l=>l.map.join('|'))).size,40,'Every mission uses a unique level geometry');
 assert.equal(new Set(ROBOLAB_LEVELS.map(l=>l.world)).size,8,'Eight worlds must exist');
 let n=0;
 for(const level of ROBOLAB_LEVELS){
  assert(level.map.every(r=>r.length===level.map[0].length),`Rectangular geometry ${level.id}`);
  assert(shortestRoute(level.map,level.start,level.goal).length>0,`Reachable goal ${level.id}`);
  const r=runProgram(level,level.reference);
  assert.equal(r.error,null,`Reference program should be error-free at ${level.id}: ${JSON.stringify(r.error)}`);
  assert.equal(r.evaluation.success,true,`Reference program must satisfy ${level.id} objectives`);
  assert(r.timeline.length>4,`Actions must be simulated ${level.id}`);
  assert(r.evaluation.stars>=1&&r.evaluation.stars<=3,`Earned stars ${level.id}`);
  n++;
 }
 const lvl=ROBOLAB_LEVELS[0];
 assert.equal(runProgram(lvl,'print("hi")').evaluation.success,false,'Text output cannot fake mission success');
 assert.equal(runProgram(lvl,'import os').error.kind,'SyntaxError','Unsafe imports blocked');
 assert.equal(runProgram(lvl,'while True:\n    robot.scan()').error.kind,'RuntimeLimit','Infinite loops must stop');
 assert.equal(runProgram(lvl,'if True\n    pass').error.kind,'SyntaxError','Colon is required');
 assert.equal(runProgram(lvl,'for i in range(3):\nrobot.scan()').error.kind,'IndentationError','Indented suites required');
 assert.equal(runProgram(lvl,'x = missing + 1').error.kind,'NameError','Undefined variable rejected');
 const basic=runProgram(lvl,'def go(n):\n    for i in range(n):\n        robot.move_forward()\ngo(2)\nif robot.obstacle_ahead():\n    robot.turn_left()');
 assert.equal(basic.error,null,'Functions, loops, conditionals and sensors must execute');
 const gated=ROBOLAB_LEVELS.find(l=>l.gate);
 const eng=new RobotEngine(gated);assert.equal(eng.blocked(gated.gate.x,gated.gate.y),true,'Closed gate blocks robot');
 eng.state.switchOn=true;assert.equal(eng.blocked(gated.gate.x,gated.gate.y),false,'Opened gate passes robot');
 const map=fs.readFileSync(path.join(__dirname,'../src/pages/arcade/ArcadeView.tsx'),'utf8');
 assert(map.includes("launch.mode==='robolab'"),'RoboLab route exists');
 const arcade=fs.readFileSync(path.join(__dirname,'../src/pages/arcade/addons/AdventureExtras.tsx'),'utf8');
 assert(arcade.includes("id:'robolab'"),'RoboLab card registered in Arcade');
 console.log(`PASS: ${n}/40 playable and solvable mission reference programs across 8 worlds; sandboxed coding, loops/functions, level uniqueness, gated collisions, Arcade integration.`);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
