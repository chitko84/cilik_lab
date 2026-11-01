/** Bounded educational Python subset. No eval/Function, network, imports or arbitrary host access. */
import {RobotEngine} from './engine';
import type {Mission} from './levels';
import type {Frame} from './engine';
export interface CodeError {kind:string;line:number;message:string;hint:string;}
type Node={kind:'line'|'if'|'while'|'for'|'def';text:string;line:number;body:Node[];elseBody:Node[]};
export interface ProgramResult {error:CodeError|null;console:string[];timeline:Frame[];evaluation:ReturnType<RobotEngine['evaluate']>;statements:number;usage:{loop:boolean;condition:boolean};}
class ScriptFailure extends Error{constructor(public kind:string,public line:number,message:string,public hint:string){super(message);}}
const maxSteps=1300,maxCallDepth=18;
function parse(code:string):Node[]{
 const src=code.replace(/\r/g,'').split('\n').map((v,i)=>({raw:v,line:i+1,spaces:v.match(/^ */)![0].length,text:v.trim()})).filter(x=>x.text&&!x.text.startsWith('#'));
 for(const s of src){if(/^\s*\t/.test(s.raw))throw new ScriptFailure('IndentationError',s.line,'Tabs are not supported. Use four spaces.','Indent code with four spaces.');if(s.spaces%4!==0)throw new ScriptFailure('IndentationError',s.line,'Use groups of four spaces.','Check indentation under if, for, while or def.');}
 let pos=0;
 const block=(depth:number):Node[]=>{const result:Node[]=[];while(pos<src.length){const s=src[pos];if(s.spaces<depth)break;if(s.spaces>depth)throw new ScriptFailure('IndentationError',s.line,'Unexpected indentation.','Indent only inside a block ending with a colon.');pos++;
  if(/^else\s*:|^elif\b/.test(s.text))throw new ScriptFailure('SyntaxError',s.line,'else or elif has no matching if.','Place else after the matching if block.');
  const m=s.text.match(/^(if|while|for|def)\b/);const kind=m?.[1] as Node['kind']|undefined;
  const n:Node={kind:kind||'line',text:s.text,line:s.line,body:[],elseBody:[]};
  if(kind){if(!s.text.endsWith(':'))throw new ScriptFailure('SyntaxError',s.line,"Expected ':' at the end of the line.",'Add a colon (:).');
    if(pos>=src.length||src[pos].spaces!==depth+4)throw new ScriptFailure('IndentationError',s.line,'This block needs indented instructions.','Indent the next line four spaces.');
    n.body=block(depth+4);
    if(kind==='if'&&pos<src.length&&src[pos].spaces===depth&&src[pos].text==='else:'){pos++;if(pos>=src.length||src[pos].spaces!==depth+4)throw new ScriptFailure('IndentationError',s.line,'else needs an indented body.','Add indented instructions under else.');n.elseBody=block(depth+4);}
  }
  result.push(n);
 }return result;};
 return block(0);
}
type Token={v:string;pos:number};
function tokens(s:string,line:number):Token[]{
 const arr:Token[]=[];let pos=0;
 while(pos<s.length){if(/\s/.test(s[pos])){pos++;continue;}
  const rest=s.slice(pos);const m=rest.match(/^(?:\d+(?:\.\d+)?|[A-Za-z_]\w*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|==|!=|<=|>=|\/\/|\*\*|[+*%\/-]|[().,:<>])/);
  if(!m)throw new ScriptFailure('SyntaxError',line,`Unsupported expression near '${rest.slice(0,12)}'.`,'Use beginner Python expressions, numbers, strings, variables or robot sensors.');
  arr.push({v:m[0],pos});pos+=m[0].length;
 }
 return arr;
}
function evaluate(expr:string,vars:Record<string,unknown>,engine:RobotEngine,line:number):unknown{
 const ts=tokens(expr,line);let ix=0;const peek=()=>ts[ix]?.v;const consume=(v?:string)=>{const t=ts[ix++];if(!t||(v&&t.v!==v))throw new ScriptFailure('SyntaxError',line,`Expected ${v||'an expression'}.`,'Check brackets and Python punctuation.');return t.v;};
 const number=(v:unknown)=>{if(typeof v!=='number')throw new ScriptFailure('TypeError',line,'A number is needed.','Use an integer or number variable.');return v;};
 const invoke=(name:string,args:unknown[])=>{
  if(name.startsWith('robot.')){const method=name.slice(6);try{return engine.sensor(method);}catch{throw new ScriptFailure('AttributeError',line,`Unknown robot sensor '${method}'.`,'Try robot.obstacle_ahead(), robot.at_goal(), robot.get_energy() or robot.path_clear().');}}
  if(name==='range'){if(args.some(x=>!Number.isInteger(x))||args.length>3||!args.length)throw new ScriptFailure('TypeError',line,'range() needs whole numbers.','Use range(4) or range(1, 5).');const start=args.length===1?0:number(args[0]),stop=args.length===1?number(args[0]):number(args[1]),step=args.length===3?number(args[2]):1;if(step===0)throw new ScriptFailure('ValueError',line,'range() step cannot be zero.','Use a step of 1 or -1.');const arr:number[]=[];for(let n=start;step>0?n<stop:n>stop;n+=step){if(arr.length>=120)throw new ScriptFailure('RuntimeLimit',line,'range() produces too many values.','Try a shorter loop (up to 120 steps).');arr.push(n);}return arr;}
  if(name==='int')return Math.trunc(Number(args[0]||0));if(name==='str')return String(args[0]??'');if(name==='abs')return Math.abs(number(args[0]));if(name==='len')return typeof args[0]==='string'||Array.isArray(args[0])?args[0].length:0;
  throw new ScriptFailure('NameError',line,`Unknown function '${name}'.`,'Use the robot commands shown in the help panel.');
 };
 function atom():unknown{
  const t=consume();if(t==='('){const v=expression(0);consume(')');return v;}
  if(t==='not')return !Boolean(expression(7));if(t==='-')return -number(expression(7));
  if(/^\d/.test(t))return Number(t);
  if(t.startsWith('"')||t.startsWith("'"))return t.slice(1,-1).replace(/\\n/g,'\n').replace(/\\(["'\\])/g,'$1');
  if(t==='True')return true;if(t==='False')return false;if(t==='None')return null;
  if(/^[A-Za-z_]\w*$/.test(t)){
    let name=t;
    if(peek()==='.'){consume('.');name+='.'+consume();}
    if(peek()==='('){consume('(');const args:unknown[]=[];while(peek()&&peek()!==')'){args.push(expression(0));if(peek()!==',')break;consume(',');}consume(')');return invoke(name,args);}
    if(Object.prototype.hasOwnProperty.call(vars,name))return vars[name];
    throw new ScriptFailure('NameError',line,`Name '${name}' is not defined.`,`Create ${name} before using it.`);
  }
  throw new ScriptFailure('SyntaxError',line,`Unexpected '${t}'.`,'Check your expression.');
 }
 const prec:Record<string,number>={or:1,and:2,'==':3,'!=':3,'<':3,'>':3,'<=':3,'>=':3,'+':4,'-':4,'*':5,'/':5,'//':5,'%':5,'**':6};
 function expression(min:number):unknown{let a=atom();while(peek()&&prec[peek()!]>=min){const op=peek()!;const priority=prec[op];if(priority===undefined)break;consume();const b=expression(priority+1);
  switch(op){case 'or':a=Boolean(a)||Boolean(b);break;case 'and':a=Boolean(a)&&Boolean(b);break;
  case '==':a=a===b;break;case '!=':a=a!==b;break;case '<':a=number(a)<number(b);break;case '>':a=number(a)>number(b);break;case '<=':a=number(a)<=number(b);break;case '>=':a=number(a)>=number(b);break;
  case '+':a=typeof a==='string'||typeof b==='string'?String(a)+String(b):number(a)+number(b);break;case '-':a=number(a)-number(b);break;case '*':a=number(a)*number(b);break;case '/':a=number(a)/number(b);break;case '//':a=Math.floor(number(a)/number(b));break;case '%':a=number(a)%number(b);break;case '**':a=number(a)**number(b);break;
  }
 }return a;}
 const v=expression(0);if(ix<ts.length)throw new ScriptFailure('SyntaxError',line,`Unexpected '${ts[ix].v}'.`,'Check the expression punctuation.');return v;
}
function splitArgs(src:string):string[]{const result:string[]=[];let start=0,depth=0,quote='';for(let i=0;i<src.length;i++){const ch=src[i];if(quote){if(ch===quote&&src[i-1]!=='\\')quote='';continue;}if(ch==='"'||ch==="'"){quote=ch;continue;}if(ch==='(')depth++;if(ch===')')depth--;if(ch===','&&depth===0){result.push(src.slice(start,i).trim());start=i+1;}}if(src.slice(start).trim())result.push(src.slice(start).trim());return result;}
export function runProgram(level:Mission,code:string):ProgramResult{
 const engine=new RobotEngine(level),out:string[]=[],vars:Record<string,unknown>={},funcs=new Map<string,{args:string[];body:Node[]}>();
 const usage={loop:false,condition:false};let error:CodeError|null=null,statements=0,depth=0;
 const fail=(e:unknown,line:number):never=>{if(e instanceof ScriptFailure)throw e;throw new ScriptFailure('RuntimeError',line,(e as Error).message||String(e),'Check robot position, arguments, and available commands.');};
 const budget=(line:number)=>{statements++;if(statements>maxSteps||engine.frames.length>2200)throw new ScriptFailure('RuntimeLimit',line,'Program stopped after too many steps.','Check for infinite loops. Limit repeated movements.');};
 const evaluateAt=(src:string,line:number)=>evaluate(src,vars,engine,line);
 const run=(nodes:Node[]):void=>{for(const n of nodes){budget(n.line);const line=n.line;try{
  if(n.kind==='if'){usage.condition=true;const condition=n.text.slice(3,-1).trim();run(Boolean(evaluateAt(condition,line))?n.body:n.elseBody);continue;}
  if(n.kind==='while'){usage.loop=true;const test=n.text.slice(6,-1).trim();let iterations=0;while(Boolean(evaluateAt(test,line))){budget(line);if(++iterations>120)throw new ScriptFailure('RuntimeLimit',line,'while loop exceeded 120 iterations.','Make sure your loop condition eventually becomes False.');run(n.body);}continue;}
  if(n.kind==='for'){usage.loop=true;const match=n.text.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);if(!match)throw new ScriptFailure('SyntaxError',line,'Use: for i in range(4):','The loop must be of the form for i in range(n):.');const items=evaluateAt(match[2],line);if(!Array.isArray(items))throw new ScriptFailure('TypeError',line,'A for loop needs an iterable range().','Try range(3).');for(const val of items){budget(line);vars[match[1]]=val;run(n.body);}continue;}
  if(n.kind==='def'){const m=n.text.match(/^def\s+([A-Za-z_]\w*)\(([^)]*)\):$/);if(!m)throw new ScriptFailure('SyntaxError',line,'Invalid function definition.','Use def my_task(): then indent the body.');funcs.set(m[1],{args:m[2].trim()?m[2].split(',').map(s=>s.trim()):[],body:n.body});continue;}
  const codeLine=n.text.replace(/\s+#.*$/,'');if(codeLine==='pass')continue;
  if(/^(import|from|open\(|eval\(|exec\(|class\s|async\s|lambda\s|global\s)/.test(codeLine))throw new ScriptFailure('SyntaxError',line,'This instruction is outside RoboLab Python.','Imports, files, networking and arbitrary Python modules are not available.');
  const assignment=codeLine.match(/^([A-Za-z_]\w*)\s*(=|\+=|-=)\s*(.+)$/);if(assignment){const v=evaluateAt(assignment[3],line);if(assignment[2]==='=')vars[assignment[1]]=v;else if(assignment[2]==='+=')vars[assignment[1]]=Number(vars[assignment[1]]||0)+Number(v);else vars[assignment[1]]=Number(vars[assignment[1]]||0)-Number(v);continue;}
  const call=codeLine.match(/^([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)?)\((.*)\)$/);if(!call)throw new ScriptFailure('SyntaxError',line,`Cannot understand '${codeLine}'.`,'Use robot.move_forward(), an assignment, if, for, while, or a function.');
  const args=splitArgs(call[2]).map(e=>evaluateAt(e,line));
  if(call[1]==='print'){out.push(args.map(String).join(' '));continue;}
  if(call[1].startsWith('robot.')){engine.action(call[1].slice(6),args,line);continue;}
  if(funcs.has(call[1])){const f=funcs.get(call[1])!;if(++depth>maxCallDepth)throw new ScriptFailure('RecursionError',line,'Function calls are nested too deeply.','Add a stopping condition.');if(args.length!==f.args.length)throw new ScriptFailure('TypeError',line,'Wrong number of function arguments.','Check the function definition.');const old=f.args.map(k=>[k,vars[k]] as const);f.args.forEach((k,i)=>vars[k]=args[i]);run(f.body);old.forEach(([k,v])=>{if(v===undefined)delete vars[k];else vars[k]=v;});depth--;continue;}
  throw new ScriptFailure('NameError',line,`Unknown command '${call[1]}'.`,'Use robot methods, print(), or functions you defined.');
 }catch(e){fail(e,line);}}};
 try{if(code.length>18000)throw new ScriptFailure('RuntimeLimit',1,'Code is too long.','Keep the program below 18,000 characters.');run(parse(code));}
 catch(e){const err=e instanceof ScriptFailure?e:new ScriptFailure('RuntimeError',1,(e as Error).message||String(e),'Check syntax and arguments.');error={kind:err.kind,line:err.line,message:err.message,hint:err.hint};}
 const evaluation=engine.evaluate(usage);
 if(!error&&evaluation.success)out.push(`Mission completed — ${evaluation.stars} stars earned!`);
 if(!error&&!evaluation.success)out.push('Program ended. Some mission objectives remain incomplete.');
 return {error,console:out,timeline:engine.frames,evaluation,statements,usage};
}
