"""CilikLab Code Time Machine tracing kernel, executed in browser Pyodide.

Records *actual CPython* line/call/return snapshots of a constrained educational
Python program. The worker is terminated by the browser on timeout/cancel.
"""
import ast
import builtins
import json
import sys

FILENAME = 'ciliklab_student.py'
MAX_CODE = 10000
MAX_EVENTS = 650
MAX_OUTPUT = 5000
MAX_REPR = 160

ALLOWED = {
    'Module','keyword','Expr','Assign','AugAssign','Name','Constant','BinOp','UnaryOp',
    'BoolOp','Compare','If','For','While','Break','Continue','Pass','FunctionDef',
    'arguments','arg','Return','List','Tuple','Dict','Set','Subscript','Slice',
    'Call','Attribute','IfExp','JoinedStr','FormattedValue','ListComp','comprehension',
    'Load','Store','Del','Add','Sub','Mult','Div','FloorDiv','Mod','Pow','UAdd','USub',
    'Not','And','Or','Eq','NotEq','Lt','LtE','Gt','GtE','In','NotIn','Is','IsNot',
    'Try','ExceptHandler','Raise',
}
ALLOWED_METHODS = {
    'append','extend','insert','pop','remove','clear','sort','reverse','count','index',
    'get','keys','values','items','copy','split','join','strip','lower','upper',
    'replace','startswith','endswith','find','capitalize',
}
ALLOWED_BUILTINS = {
    'print','range','len','min','max','sum','abs','round','sorted','reversed',
    'enumerate','zip','any','all','int','float','str','bool','list','dict',
    'set','tuple','isinstance',
    'ValueError','TypeError','ZeroDivisionError','NameError','IndexError',
    'KeyError','Exception',
}

class CodeLimit(Exception):
    pass

class SafetyError(Exception):
    pass

def _check(tree):
    for node in ast.walk(tree):
        if type(node).__name__ not in ALLOWED:
            raise SafetyError(f'{type(node).__name__} is not available in the learning debugger.')
        if isinstance(node, ast.Name) and (node.id.startswith('__') or (node.id.startswith('_') and node.id != '_')):
            raise SafetyError(f'{node.id} is not available in the learning debugger.')
        if isinstance(node, (ast.FunctionDef, ast.arg)):
            name = node.name if isinstance(node, ast.FunctionDef) else node.arg
            if name.startswith('_') or '__' in name:
                raise SafetyError('Use a function or variable name without leading underscores.')
        if isinstance(node, ast.Attribute) and node.attr not in ALLOWED_METHODS:
            raise SafetyError(f'Method .{node.attr}() is not available in this learning debugger.')
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id in {'eval','exec','compile','open','input','globals','locals','vars','dir','getattr','setattr','delattr','__import__','object','type','super','breakpoint','help'}:
            raise SafetyError(f'{node.func.id}() is unavailable here.')
        if isinstance(node, (ast.FunctionDef, ast.Lambda)) and hasattr(node, 'decorator_list') and node.decorator_list:
            raise SafetyError('Function decorators are not supported here.')
        if isinstance(node, ast.Try) and getattr(node, 'finalbody', []):
            raise SafetyError('try/finally is not supported in the learning debugger.')

def _simplify(value, depth=0):
    if depth > 3: return '…'
    if value is None or isinstance(value, (bool,int,float,str)):
        if isinstance(value,str): return value[:MAX_REPR] + ('…' if len(value)>MAX_REPR else '')
        return value
    if isinstance(value, (list,tuple,set)):
        values = list(value)
        return {'kind':type(value).__name__, 'items':[_simplify(x,depth+1) for x in values[:16]],'length':len(values)}
    if isinstance(value,dict):
        return {'kind':'dict','items':[[str(k)[:45],_simplify(v,depth+1)] for k,v in list(value.items())[:12]],'length':len(value)}
    if callable(value): return '<function>'
    return f'<{type(value).__name__}>'

def _safe_frame_vars(frame):
    return {k:_simplify(v) for k,v in list(frame.f_locals.items())[:35] if not k.startswith('__') and k != '__builtins__'}

def _ciko_execute(source):
    source = str(source)
    snapshots = []
    console = []
    current_error = None
    if len(source) > MAX_CODE:
        return json.dumps({'steps':[], 'stdout':'', 'error':{'type':'CodeLimit','message':'Please use a program shorter than 10,000 characters.','line':1}, 'limited':False})
    try:
        tree = ast.parse(source, filename=FILENAME)
        _check(tree)
        compiled = compile(tree, FILENAME, 'exec')
    except (SyntaxError, SafetyError) as e:
        return json.dumps({'steps':[], 'stdout':'', 'error':{'type':type(e).__name__, 'message':str(e), 'line':getattr(e,'lineno',1) or 1}, 'limited':False})

    text_lines = source.splitlines()
    user_stack = []
    step_count = 0
    def capture(frame, event, arg=None):
        nonlocal step_count
        if frame.f_code.co_filename != FILENAME:
            return capture
        if event == 'call':
            user_stack.append(frame)
        if event in ('line','return','exception'):
            step_count += 1
            if step_count > MAX_EVENTS:
                raise CodeLimit('Execution stopped after 650 recorded steps. Check your loops or simplify the program.')
            stack = [{'name': f.f_code.co_name if f.f_code.co_name != '<module>' else 'main',
                      'line':f.f_lineno, 'locals':_safe_frame_vars(f)} for f in user_stack[-12:]]
            number = frame.f_lineno
            record = {
                'event':event,
                'line':number,
                'text':text_lines[number-1].strip() if 1 <= number <= len(text_lines) else '',
                'stack':stack,
                'variables':_safe_frame_vars(frame),
                'output': ''.join(console)[-MAX_OUTPUT:],
            }
            if event == 'return':
                record['returned'] = _simplify(arg)
            elif event == 'exception':
                record['exception'] = {'type':type(arg[1]).__name__, 'message':str(arg[1])[:300]}
            snapshots.append(record)
        if event == 'return' and frame in user_stack:
            user_stack.remove(frame)
        return capture

    def safe_print(*values, sep=' ',end='\n'):
        s = str(sep).join(str(x) for x in values) + str(end)
        if sum(len(x) for x in console)+len(s)>MAX_OUTPUT:
            raise CodeLimit('Printed output exceeded the 5,000-character limit.')
        console.append(s)

    safe_globals = {'__builtins__':{name:(safe_print if name=='print' else getattr(builtins,name)) for name in ALLOWED_BUILTINS},'__name__':'__main__'}
    before = sys.gettrace()
    try:
        sys.settrace(capture)
        exec(compiled, safe_globals, safe_globals)
    except BaseException as e:
        current_error = {'type':type(e).__name__, 'message':str(e)[:500], 'line': 0}
        tb = e.__traceback__
        while tb:
            if tb.tb_frame.f_code.co_filename == FILENAME:
                current_error['line'] = tb.tb_lineno
            tb = tb.tb_next
        if not current_error['line']: current_error['line'] = max(1, snapshots[-1]['line'] if snapshots else 1)
    finally:
        sys.settrace(before)
    return json.dumps({'steps':snapshots, 'stdout':''.join(console)[-MAX_OUTPUT:], 'error':current_error, 'limited':bool(current_error and current_error['type']=='CodeLimit')})
