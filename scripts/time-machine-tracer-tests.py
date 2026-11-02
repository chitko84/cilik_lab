"""Test the same tracer.py that executes within browser Pyodide using native CPython."""
from pathlib import Path
import ast
import json
import re

ROOT = Path(__file__).resolve().parents[1]
namespace = {}
exec((ROOT/'public/time-machine/tracer.py').read_text(encoding='utf8'),namespace)
trace = lambda code: json.loads(namespace['_ciko_execute'](code))
source = (ROOT/'src/pages/time-machine/samples.ts').read_text(encoding='utf8')
samples = re.findall(r"code:('(?:\\.|[^'\\])*')",source)
assert len(samples)>=20,(len(samples),'not enough examples')
for i, encoded in enumerate(samples,1):
    code=ast.literal_eval(encoded)
    out=trace(code)
    assert out['steps'], ('no real trace events',i)
    assert all(step['line']>0 and step['event'] in ('line','return','exception') for step in out['steps']),('invalid events',i)
    assert len(out['steps']) <= 650,('unbounded trace',i)
    if i not in (7,8,23):
        assert out['error'] is None, ('failed sample',i,out['error'])
assert trace('x=1\nx+=5\nprint(x)')['stdout']=='6\n'
assert trace('n=1\nn=2\nprint(n)')['steps'][1]['variables']['n']==1
func=trace('def double(v):\n    tmp=v*2\n    return tmp\nprint(double(3))')
assert any(any(frame['name']=='double' for frame in step['stack']) for step in func['steps'])
assert func['stdout']=='6\n'
assert trace('for i in range(3):\n    print(i)')['stdout']=='0\n1\n2\n'
assert trace('try:\n    x = 10/0\nexcept ZeroDivisionError:\n    x = 0\nprint(x)')['error'] is None
assert trace('print(missing)')['error']['type']=='NameError'
assert trace('if True\n    print(1)')['error']['type']=='SyntaxError'
assert trace('import os')['error']['type']=='SafetyError'
assert trace('print((1).__class__)')['error']['type']=='SafetyError'
assert trace('open("file.txt")')['error']['type']=='SafetyError'
assert trace('for _ in range(100000):\n    pass')['error']['type']=='CodeLimit'
assert trace('while True:\n    pass')['error']['type']=='CodeLimit'
assert trace('print("a" * 6000)')['error']['type']=='CodeLimit'
assert trace('print("safe")')['stdout']=='safe\n', 'trace must not leak globals between runs'
print(f'PASS: {len(samples)} starter programs and 16 Python execution/security assertions')
