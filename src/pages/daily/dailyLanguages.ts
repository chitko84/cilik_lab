/** Language-specific beginner execution for the Daily Coding Challenge only.
 * C and Java are deliberately small, safely interpreted teaching subsets,
 * not full native compilers or a general-purpose arbitrary code execution API.
 */
import type {DailyProblem,DailyRecord} from './dailyBank';

export type DailyLanguage = 'python' | 'c' | 'java';
export const DAILY_LANGUAGES: {id:DailyLanguage;label:string;extension:string;runtime:string}[] = [
 {id:'python',label:'Python',extension:'py',runtime:'Python 3 · teaching subset'},
 {id:'c',label:'C',extension:'c',runtime:'C · beginner teaching subset'},
 {id:'java',label:'Java',extension:'java',runtime:'Java · beginner teaching subset'}
];
export const LANGUAGE_PREF_KEY='ciliklab_daily_language_v1';
export const DAILY_DRAFT_KEY='ciliklab_daily_language_drafts_v1';
export function readDailyLanguage():DailyLanguage {
 try{const language=localStorage.getItem(LANGUAGE_PREF_KEY);return language==='c'||language==='java'?language:'python'}catch{return 'python'}
}
export function readDailyDrafts():Record<string,string>{
 try{const stored=JSON.parse(localStorage.getItem(DAILY_DRAFT_KEY)||'{}');return stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{}}catch{return {}}
}
export function readDailyLanguageRecords(language:Exclude<DailyLanguage,'python'>):Record<string,DailyRecord>{
 try{const stored=JSON.parse(localStorage.getItem(`ciliklab_daily_records_${language}_v1`)||'{}');return stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{}}catch{return {}}
}
export function dailyStarter(problem:DailyProblem,language:DailyLanguage){
 if(language==='python')return problem.starter;
 if(language==='c')return '#include <stdio.h>\n\nint main(void) {\n    // Write your C solution here\n    // Example: printf("Hello\\n");\n    return 0;\n}\n';
 return 'public class Main {\n    public static void main(String[] args) {\n        // Write your Java solution here\n        // Example: System.out.println("Hello");\n    }\n}\n';
}
export function dailyLanguageCopy(problem:DailyProblem,language:DailyLanguage,localized:{story:string;instructions:string;hint:string;skill?:string}){
 if(language==='python')return {...localized,skill:problem.skill};
 const name=language==='c'?'C':'Java';
 const print=language==='c'?'printf() or puts()':'System.out.println()';
 let instructions=localized.instructions.replace(/Python/g,name).replace(/print\(\)/gi,print).replace(/\bprint\b/gi,'display');
 if(problem.skill==='floor division')instructions += language==='c'?' Use integer division (/) with int values.':' Use integer division (/) with int values.';
 const skill=problem.skill.replace(/print\(\)/gi,print).replace(/floor division/gi,'integer division');
 const hints:Record<string,string>={
  'print()':language==='c'?'Use puts("Message"); or printf("Message\\n");':'Use System.out.println("Message");',
  addition:language==='c'?'Use printf("%d\\n", 2 + 3);':'Use System.out.println(2 + 3);',
  arithmetic:language==='c'?'Use printf("%d\\n", 2 + 3);':'Use System.out.println(2 + 3);',
  subtraction:'Subtract numbers with - and display the result.',
  multiplication:'Multiply numbers with * and display the result.',
  modulo:'Use % to get the remainder.',
  'floor division':'Use / between two int values to divide into whole numbers.',
  variables:'Declare an int variable, for example int score = 5; then update it with += or -=.',
  sequences:'Write one output statement for each line.',
  loops:'Use a for loop with a counter, e.g. for (int i = 3; i > 0; i--) { ... }',
  'for loops':'Use a for loop such as for (int i = 0; i < 4; i++) { ... }',
  conditions:'Write if (condition) { ... } else { ... }',
  'if / else':'Write if (condition) { ... } else { ... }',
  'combined operations':'Calculate with variables, + and *, then display the result.',
  'variables + loop + condition':'Declare an int score, update it inside a for loop, then check it with if / else.'
 };
 return {story:localized.story.replace(/Python/g,name),instructions,skill,hint:`${hints[problem.skill]||'Use the language syntax shown in the starter template.'} ${language==='c'?'Put your statements inside int main(void).':'Put your statements inside main in class Main.'}`};
}

type Value=number|string|boolean;
type Token={value:string;type:'id'|'number'|'string'|'symbol';pos:number};
type Expr={kind:'literal';value:Value}|{kind:'variable';name:string}|{kind:'unary';op:string;expr:Expr}|{kind:'binary';op:string;left:Expr;right:Expr};
type Statement=
 |{kind:'block';body:Statement[]}
 |{kind:'declare'|'assign';name:string;op:string;value:Expr}
 |{kind:'increment';name:string;amount:number}
 |{kind:'print';method:'printf'|'puts'|'println'|'print';args:Expr[]}
 |{kind:'if';condition:Expr;then:Statement;otherwise?:Statement}
 |{kind:'for';start:Statement;condition:Expr;update:Statement;body:Statement}
 |{kind:'return'};
const types=new Set(['int','long','double','float','boolean','String']);
const operators=['>=','<=','==','!=','&&','||','+=','-=','*=','/=','++','--'];
function tokenize(source:string):Token[]{
 if(source.length>16000)throw Error('Solution is too long (16,000-character limit).');
 const out:Token[]=[];let i=0;
 while(i<source.length){
  const start=i,c=source[i];
  if(/\s/.test(c)){i++;continue}
  if(source.startsWith('//',i)){i=source.indexOf('\n',i);if(i<0)i=source.length;continue}
  if(source.startsWith('/*',i)){const end=source.indexOf('*/',i+2);if(end<0)throw Error('Unclosed /* comment.');i=end+2;continue}
  if(c==='"'){
   i++;let escaped=false;
   while(i<source.length){const char=source[i++];if(char==='"'&&!escaped)break;if(char==='\\'&&!escaped){escaped=true;continue}escaped=false}
   if(source[i-1]!=='"'||(source[i-2]==='\\'&&source[i-3]!=='\\'))throw Error('Unclosed string quotation mark.');
   out.push({type:'string',value:source.slice(start,i),pos:start});continue;
  }
  if(/[A-Za-z_]/.test(c)){i++;while(i<source.length&&/[A-Za-z0-9_]/.test(source[i]))i++;out.push({type:'id',value:source.slice(start,i),pos:start});continue}
  if(/[0-9]/.test(c)){i++;while(i<source.length&&/[0-9]/.test(source[i]))i++;out.push({type:'number',value:source.slice(start,i),pos:start});continue}
  const operator=operators.find(op=>source.startsWith(op,i));if(operator){i+=operator.length;out.push({type:'symbol',value:operator,pos:start});continue}
  if('{}();=+-*/%<>!,[].'.includes(c)){i++;out.push({type:'symbol',value:c,pos:start});continue}
  throw Error(`Unsupported character ${JSON.stringify(c)} at position ${start+1}.`);
  }
  if(out.length>4500)throw Error('Too many tokens in solution.');
  return out;
}
const precedence:Record<string,number>={'||':1,'&&':2,'==':3,'!=':3,'<':4,'>':4,'<=':4,'>=':4,'+':5,'-':5,'*':6,'/':6,'%':6};
class Parser{
 private i=0;
 constructor(private readonly tokens:Token[],private readonly language:'c'|'java'){}
 private peek(){return this.tokens[this.i]?.value||'<end>'}
 private take(){const token=this.tokens[this.i++];if(!token)throw Error('Unexpected end of code.');return token}
 private expect(value:string){if(this.peek()!==value)throw Error(`Expected ${JSON.stringify(value)}, found ${JSON.stringify(this.peek())}.`);this.i++}
 private identifier(){const token=this.take();if(token.type!=='id')throw Error(`Expected a variable name, found ${JSON.stringify(token.value)}.`);return token.value}
 parse():Statement[]{
  if(this.language==='c'){
   this.expect('int');this.expect('main');this.expect('(');if(this.peek()==='void')this.take();this.expect(')');
  }else{
   if(this.peek()==='public')this.take();this.expect('class');this.expect('Main');this.expect('{');
   for(const modifier of ['public','static','void','main','(','String','[',']'])this.expect(modifier);
   this.identifier();this.expect(')');
  }
  const body=this.block().body;
  if(this.language==='java')this.expect('}');
  if(this.i!==this.tokens.length)throw Error(`Unexpected code after main(): ${JSON.stringify(this.peek())}.`);
  return body;
 }
 private block():{kind:'block';body:Statement[]}{
  this.expect('{');const body:Statement[]=[];
  while(this.peek()!=='}'){
   if(this.peek()==='<end>')throw Error('Missing closing } for a code block.');
   if(body.length>500)throw Error('Too many statements.');
   body.push(this.statement());
  }
  this.expect('}');return {kind:'block',body};
 }
 private statement():Statement{
  const word=this.peek();
  if(word==='{')return this.block();
  if(word==='if'){
   this.take();this.expect('(');const condition=this.expression();this.expect(')');const then=this.statement();let otherwise:Statement|undefined;
   if(this.peek()==='else'){this.take();otherwise=this.statement()}
   return {kind:'if',condition,then,otherwise};
  }
  if(word==='for'){
   this.take();this.expect('(');const start=this.assignment();this.expect(';');const condition=this.expression();this.expect(';');const update=this.assignment();this.expect(')');const body=this.statement();
   return {kind:'for',start,condition,update,body};
  }
  if(word==='return'){
   this.take();const value=this.take().value;if(value!=='0')throw Error('Only return 0; is supported in this beginner C runtime.');this.expect(';');return {kind:'return'};
  }
  if(word==='printf'||word==='puts'||word==='System'){
   let method:'printf'|'puts'|'println'|'print';
   if(word==='System'){
    if(this.language!=='java')throw Error('Use printf() or puts() for C output.');
    this.take();this.expect('.');this.expect('out');this.expect('.');const name=this.take().value;
    if(name!=='print'&&name!=='println')throw Error('Use System.out.println() or System.out.print().');method=name;
   }else{
    if(this.language!=='c')throw Error('Use System.out.println() for Java output.');
    method=this.take().value as 'printf'|'puts';
   }
   this.expect('(');const args:Expr[]=[];
   if(this.peek()!==')'){args.push(this.expression());while(this.peek()===','){this.take();args.push(this.expression())}}
   this.expect(')');this.expect(';');return {kind:'print',method,args};
  }
  const value=this.assignment();this.expect(';');return value;
 }
 private assignment():Statement{
  let kind:'declare'|'assign'='assign';
  if(types.has(this.peek())){this.take();kind='declare'}
  const name=this.identifier();const op=this.take().value;
  if(op==='++'||op==='--'){
   if(kind==='declare')throw Error(`Give ${name} a starting value before incrementing.`);
   return {kind:'increment',name,amount:op==='++'?1:-1};
  }
  if(!['=','+=','-=','*=','/='].includes(op))throw Error(`Expected assignment (=, +=, -=) after ${name}.`);
  return {kind,name,op,value:this.expression()};
 }
 private expression(min=0):Expr{
  let expr:Expr;const token=this.take();
  if(token.value==='('){expr=this.expression();this.expect(')')}
  else if(['-','+','!'].includes(token.value)){expr={kind:'unary',op:token.value,expr:this.expression(7)}}
  else if(token.type==='string'){
   let value:string;try{value=JSON.parse(token.value)}catch{throw Error('Invalid string escape. Use \\n to create a newline.')}expr={kind:'literal',value};
  }else if(token.type==='number')expr={kind:'literal',value:Number(token.value)};
  else if(token.type==='id'&&['true','false'].includes(token.value))expr={kind:'literal',value:token.value==='true'};
  else if(token.type==='id')expr={kind:'variable',name:token.value};
  else throw Error(`Expected a value, found ${JSON.stringify(token.value)}.`);
  while(precedence[this.peek()]!==undefined&&precedence[this.peek()]>=min){const op=this.take().value;const right=this.expression(precedence[op]+1);expr={kind:'binary',op,left:expr,right}}
  return expr;
 }
}
function evalExpr(expr:Expr,variables:Map<string,Value>):Value{
 if(expr.kind==='literal')return expr.value;
 if(expr.kind==='variable'){
  if(!variables.has(expr.name))throw Error(`Variable ${expr.name} is not defined. Declare it with int ${expr.name} = ...;`);
  return variables.get(expr.name)!;
 }
 if(expr.kind==='unary'){
  const value=evalExpr(expr.expr,variables);
  if(expr.op==='!')return !value;
  if(typeof value!=='number')throw Error('Unary + and - need a number.');
  return expr.op==='-'?-value:+value;
 }
 const a=evalExpr(expr.left,variables);
 if(expr.op==='&&')return Boolean(a)&&Boolean(evalExpr(expr.right,variables));
 if(expr.op==='||')return Boolean(a)||Boolean(evalExpr(expr.right,variables));
 const b=evalExpr(expr.right,variables);
 switch(expr.op){
  case '==':return a===b;case '!=':return a!==b;case '<':return a<b;case '>':return a>b;case '<=':return a<=b;case '>=':return a>=b;
  case '+':return typeof a==='string'||typeof b==='string'?String(a)+String(b):Number(a)+Number(b);
  case '-':return Number(a)-Number(b);case '*':return Number(a)*Number(b);
  case '/':if(!Number(b))throw Error('Cannot divide by zero.');return Math.trunc(Number(a)/Number(b));
  case '%':if(!Number(b))throw Error('Cannot divide by zero.');return Number(a)%Number(b);
 }
 throw Error(`Unsupported operator ${expr.op}.`);
}
export function runDailyTeachingCode(code:string,language:'c'|'java'):{success:boolean;stdout:string;error?:{friendlyExplanation:string}}{
 let stdout='';let steps=0;const vars=new Map<string,Value>();
 const emit=(value:string)=>{stdout+=value;if(stdout.length>12000)throw Error('Output limit reached. Check your loops.')};
 const count=()=>{if(++steps>6000)throw Error('Execution limit reached. Check for an endless loop.')};
 const execute=(s:Statement):void=>{
  count();
  switch(s.kind){
   case 'block':s.body.forEach(execute);break;
   case 'declare':case 'assign':{
    if(s.kind==='assign'&&!vars.has(s.name))throw Error(`Declare ${s.name} before assigning it.`);
    const v=evalExpr(s.value,vars);const prev=vars.get(s.name);
    let next:Value=v;
    if(s.op!== '='){
     if(prev===undefined)throw Error(`Declare ${s.name} before updating it.`);
     if(s.op==='+=')next=typeof prev==='string'?prev+String(v):Number(prev)+Number(v);
     if(s.op==='-=')next=Number(prev)-Number(v);
     if(s.op==='*=')next=Number(prev)*Number(v);
     if(s.op==='/='){if(!Number(v))throw Error('Cannot divide by zero.');next=Math.trunc(Number(prev)/Number(v))}
    }
    vars.set(s.name,next);break;
   }
   case 'increment':{
    if(!vars.has(s.name))throw Error(`Declare ${s.name} before using ++ or --.`);
    vars.set(s.name,Number(vars.get(s.name))+s.amount);break;
   }
   case 'print':{
    const args=s.args.map(arg=>evalExpr(arg,vars));
    if(s.method==='puts'){if(args.length!==1)throw Error('puts() needs one argument.');emit(String(args[0])+'\n');break}
    if(s.method==='println'||s.method==='print'){
     if(args.length>1)throw Error('System.out.println() accepts one value.');emit((args[0]===undefined?'':String(args[0]))+(s.method==='println'?'\n':''));break;
    }
    if(!args.length||typeof args[0]!=='string')throw Error('printf() needs a quoted format string, e.g. printf("%d\\n", number);');
    let n=1;let result='';const format=args[0];
    for(let i=0;i<format.length;i++){
     if(format[i]==='%'){
      const spec=format[++i];
      if(spec==='%'){result+='%';continue}
      if(!['d','i','s','c'].includes(spec))throw Error('This teaching subset supports printf %d, %i, %s, and %c.');
      if(n>=args.length)throw Error('Missing value for printf format placeholder.');
      const value=args[n++];result+=spec==='d'||spec==='i'?String(Math.trunc(Number(value))):String(value);
     }else result+=format[i];
    }
    if(n!==args.length)throw Error('Too many arguments for printf format.');emit(result);break;
   }
   case 'if':execute(evalExpr(s.condition,vars)?s.then:(s.otherwise||{kind:'block',body:[]}));break;
   case 'for':execute(s.start);while(Boolean(evalExpr(s.condition,vars))){count();execute(s.body);execute(s.update)}break;
   case 'return':break;
  }
 };
 try{
  if(language==='c'){
   // Remove only standard #include directives; other preprocessor directives are intentionally unsupported.
   code=code.replace(/^\s*#include\s*<stdio\.h>\s*$/gm,'');
  }
  const ast=new Parser(tokenize(code),language).parse();ast.forEach(execute);
  return {success:true,stdout};
 }catch(error){return {success:false,stdout,error:{friendlyExplanation:error instanceof Error?error.message:'Could not run this beginner-language example.'}}}
}
