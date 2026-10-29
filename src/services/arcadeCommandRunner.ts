import type { Direction } from '../pages/arcade/arcadeData';

export type ParsedMove = { direction: Direction; line: number };
export class CommandError extends Error {
  readonly line: number; readonly kind: string;
  constructor(line: number, kind: string) { super(kind); this.name='CommandError'; this.line=line; this.kind=kind; }
}

type Statement = {type:'move';dir:Direction;line:number} | {type:'loop';count:number;body:Statement[];line:number};
const MAX_COMMANDS = 100;
/**
 * A narrow, intentionally sandboxed Python-like movement language for children.
 * Never evaluates JavaScript, never invokes the Python workspace runner, and
 * never accepts imports, expressions, system calls, or arbitrary user code.
 */
export function compileMazeCommands(source: string): ParsedMove[] {
  if(source.length>4000) throw new CommandError(1,'too_long');
  const raw=source.replace(/\r\n/g,'\n').split('\n');
  if(raw.length>100)throw new CommandError(1,'too_many_lines');
  const rows=raw.map((text,i)=>({text:text.replace(/\t/g,'    '),number:i+1})).filter(r=>r.text.trim()!==''&&!r.text.trim().startsWith('#'));
  let idx=0;
  function block(depth:number):Statement[]{
    const nodes:Statement[]=[];
    while(idx<rows.length){
      const row=rows[idx], spaces=(row.text.match(/^ */)?.[0]??'').length;
      if(spaces < depth*4) break;
      if(spaces!==depth*4)throw new CommandError(row.number,'indent');
      const line=row.text.trim();idx++;
      const cmd=/^move_(up|down|left|right)\(\)\s*(?:#.*)?$/.exec(line);
      if(cmd){nodes.push({type:'move',dir:cmd[1] as Direction,line:row.number});continue;}
      const loop=/^for\s+[A-Za-z_]\w*\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*(?:#.*)?$/.exec(line);
      if(loop){
        if(depth>=2)throw new CommandError(row.number,'nested');
        const count=Number(loop[1]);if(count<1||count>20)throw new CommandError(row.number,'range');
        if(idx>=rows.length)throw new CommandError(row.number,'empty_loop');
        const body=block(depth+1);if(body.length===0)throw new CommandError(row.number,'empty_loop');
        nodes.push({type:'loop',count,body,line:row.number});continue;
      }
      throw new CommandError(row.number,'unknown');
    }
    return nodes;
  }
  const program=block(0);
  if(idx<rows.length)throw new CommandError(rows[idx].number,'indent');
  if(!program.length)throw new CommandError(1,'empty');
  const result:ParsedMove[]=[];
  function flatten(nodes:Statement[]) { for(const stmt of nodes){if(stmt.type==='move'){result.push({direction:stmt.dir,line:stmt.line});if(result.length>MAX_COMMANDS)throw new CommandError(stmt.line,'too_many_steps');}else for(let i=0;i<stmt.count;i++)flatten(stmt.body);}}
  flatten(program);
  return result;
}
