/**
 * A safe, intentionally small Python-3-style runner for hero challenges 151–300.
 * Converts supported indentation-based beginner statements into the already
 * bounded C teaching interpreter. No eval(), Python imports, network or native
 * code execution occurs. Other CilikLab workspaces keep their own runners.
 */
import {runDailyTeachingCode} from './dailyLanguages';

type Line={line:number;indent:number;body:string};
type Node =
  |{kind:'assign';name:string;op:string;expr:string;line:number}
  |{kind:'print';expr:string;line:number}
  |{kind:'for';name:string;start:string;stop:string;step:number;body:Node[];line:number}
  |{kind:'if';branches:{condition:string;body:Node[]}[];otherwise:Node[];line:number};
type Result={success:boolean;stdout:string;error?:{friendlyExplanation:string}};

function argumentsOf(raw:string){
  const args:string[]=[];let depth=0, quote='',start=0;
  for(let i=0;i<raw.length;i++){
    const c=raw[i];
    if(quote){if(c===quote&&raw[i-1]!=='\\')quote='';continue}
    if(c==='"'||c==="'"){quote=c;continue}
    if(c==='(')depth++;
    else if(c===')')depth--;
    else if(c===','&&depth===0){args.push(raw.slice(start,i).trim());start=i+1}
  }
  args.push(raw.slice(start).trim());return args;
}
function safeExpr(expression:string){
  const expr=expression.trim();
  if(!expr||expr.length>200)throw Error('Check your expression length and spelling.');
  if(/[;{}\[\]`]/.test(expr)||/\b(?:import|exec|eval|lambda|class|while|open|global|await|async|os|sys)\b|__/.test(expr))throw Error('Only beginner numbers, strings, variables, comparisons and arithmetic are available here.');
  // The C parser is the second syntax and resource-safety gate.
  return expr.replace(/\bTrue\b/g,'true').replace(/\bFalse\b/g,'false').replace(/\band\b/g,'&&').replace(/\bor\b/g,'||').replace(/\bnot\b/g,'!').replace(/\/\//g,'/');
}
function pythonToC(source:string):string{
  if(source.length>16000)throw Error('Your program is too long. Try a shorter solution.');
  const lines:Line[]=source.replace(/\r\n/g,'\n').split('\n').map((body,index)=>({line:index+1,indent:(body.match(/^[ \t]*/)?.[0]||'').replace(/\t/g,'    ').length,body:body.trim()})).filter(line=>line.body&&!line.body.startsWith('#'));
  if(lines.length>240)throw Error('Too many instructions. Shorten the program.');
  if(!lines.length)throw Error('Write some Python commands before running.');
  let index=0;
  function block(indent:number):Node[]{
    const nodes:Node[]=[];
    while(index<lines.length){
      const line=lines[index];
      if(line.indent<indent)break;
      if(line.indent>indent)throw Error(`Unexpected indentation on line ${line.line}. Align the instruction with its block.`);
      const value=line.body;
      if(/^(?:else|elif)\b/.test(value))break;
      const conditional=value.match(/^if\s+(.+):$/);
      const loop=value.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\((.+)\):$/);
      if(conditional){
        index++;
        const readBody=()=>{const next=lines[index];if(!next||next.indent<=indent)throw Error(`Line ${line.line}: indent the body of the if statement.`);return block(next.indent)};
        const branches=[{condition:safeExpr(conditional[1]),body:readBody()}];
        let otherwise:Node[]=[];
        while(index<lines.length&&lines[index].indent===indent){
          const e=lines[index].body.match(/^elif\s+(.+):$/);
          if(e){index++;branches.push({condition:safeExpr(e[1]),body:readBody()});continue}
          if(lines[index].body==='else:'){index++;otherwise=readBody();break}
          break;
        }
        nodes.push({kind:'if',branches,otherwise,line:line.line});continue;
      }
      if(loop){
        index++;
        const args=argumentsOf(loop[2]);
        if(args.length<1||args.length>3||!args.every(Boolean))throw Error(`Line ${line.line}: range() needs one, two or three values.`);
        const [start,stop,step]=args.length===1?['0',args[0],'1']:args.length===2?[args[0],args[1],'1']:args;
        const stride=Number(step);
        if(!Number.isInteger(stride)||Math.abs(stride)!==1)throw Error(`Line ${line.line}: use a range() step of 1 or -1 in these beginner challenges.`);
        const next=lines[index];if(!next||next.indent<=indent)throw Error(`Line ${line.line}: indent your for loop's body.`);
        nodes.push({kind:'for',name:loop[1],start:safeExpr(start),stop:safeExpr(stop),step:stride,body:block(next.indent),line:line.line});continue;
      }
      const print=value.match(/^print\((.*)\)$/);
      if(print){index++;nodes.push({kind:'print',expr:print[1].trim(),line:line.line});continue}
      const assign=value.match(/^([A-Za-z_]\w*)\s*(=|\+=|-=|\*=|\/=)\s*(.+)$/);
      if(assign){index++;nodes.push({kind:'assign',name:assign[1],op:assign[2],expr:assign[3],line:line.line});continue}
      throw Error(`Line ${line.line}: unsupported instruction. Use print(), variables, for range(), and if / else.`);
    }
    return nodes;
  }
  if(lines[0].indent>0)throw Error('Start your first instruction at the left edge (no indentation).');
  const nodes=block(0);
  if(index!==lines.length)throw Error(`Line ${lines[index].line}: else/elif needs a matching if.`);
  const known=new Set<string>();
  const output:string[]=[];
  function emit(tree:Node[],level:number){
    const pad='    '.repeat(level);
    for(const node of tree){
      if(node.kind==='assign'){
        const code=safeExpr(node.expr);
        if(node.op==='='){
          const first=!known.has(node.name);known.add(node.name);
          output.push(`${pad}${first?'int ':''}${node.name} = ${code};`);
        }else{
          if(!known.has(node.name))throw Error(`Line ${node.line}: set ${node.name} before updating it.`);
          output.push(`${pad}${node.name} ${node.op} ${code};`);
        }
      }else if(node.kind==='print'){
        const expression=safeExpr(node.expr);
        if(/^(['"]).*\1$/.test(expression)){
          const text=expression.startsWith("'")?JSON.stringify(expression.slice(1,-1)):expression;
          output.push(`${pad}puts(${text});`);
        }else output.push(`${pad}printf("%d\\n", ${expression});`);
      }else if(node.kind==='for'){
        known.add(node.name);
        output.push(`${pad}for (int ${node.name} = ${node.start}; ${node.name} ${node.step>0?'<':'>'} ${node.stop}; ${node.name}${node.step>0?'++':'--'}) {`);
        emit(node.body,level+1);output.push(`${pad}}`);
      }else if(node.kind==='if'){
        node.branches.forEach((branch,i)=>{
          output.push(`${pad}${i?'else ':''}if (${branch.condition}) {`);emit(branch.body,level+1);output.push(`${pad}}`);
        });
        if(node.otherwise.length){output.push(`${pad}else {`);emit(node.otherwise,level+1);output.push(`${pad}}`)}
      }
    }
  }
  emit(nodes,1);
  return ['#include <stdio.h>','int main(void) {',...output,'    return 0;','}'].join('\n');
}
export function runHeroDailyPython(source:string):Result{
  try{return runDailyTeachingCode(pythonToC(source),'c')}
  catch(error){return {success:false,stdout:'',error:{friendlyExplanation:error instanceof Error?error.message:'Check your Python syntax and indentation.'}}}
}
