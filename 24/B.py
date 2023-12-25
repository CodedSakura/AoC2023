from z3 import *

x, y, z, dx, dy, dz = Ints("x y z dx dy dz")
# t1, t2, t3, t4 = Ints("t1 t2 t3 t4")
t = [Int(f"t{i}") for i in range(3)];
# print(t)

s = Solver()
with open("input.txt") as f:
	data = [tuple(tuple(int(n.strip()) for n in d.strip().split(",")) for d in l.split("@")) for l in f.read().split("\n")[:3]]

	for i in range(3):
		((cx, cy, cz), (cdx, cdy, cdz)) = data[i]
		s.add(x + t[i] * dx == cx + t[i] * cdx)
		s.add(y + t[i] * dy == cy + t[i] * cdy)
		s.add(z + t[i] * dz == cz + t[i] * cdz)
		s.add(t[i] > 0)

	if s.check() == sat:
		model = s.model();
		print(model[x].as_long() + model[y].as_long() + model[z].as_long())
	# elseprint(data)
"""
s.add(19+(-2)*t1 == x+t1*dx)
s.add(13+(+1)*t1 == y+t1*dy)
s.add(30+(-2)*t1 == z+t1*dz)
s.add(t1 >= 0)

s.add(18+(-1)*t2 == x+t2*dx)
s.add(19+(-1)*t2 == y+t2*dy)
s.add(22+(-2)*t2 == z+t2*dz)
s.add(t2 >= 0)

s.add(20+(-2)*t3 == x+t3*dx)
s.add(25+(-2)*t3 == y+t3*dy)
s.add(34+(-4)*t3 == z+t3*dz)
s.add(t3 >= 0)

# # 12, 31, 28 @ -1, -2, -1
s.add(12+(-1)*t4 == x+t4*dx)
s.add(31+(-2)*t4 == y+t4*dy)
s.add(28+(-1)*t4 == z+t4*dz)
s.add(t4 >= 0)

if s.check() == sat:
	print(s.model())
else:
	print("unsat")
	print(s)
"""
