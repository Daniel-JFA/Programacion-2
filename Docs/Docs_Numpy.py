import numpy as np

# Creación básica
a = np.array([1, 2, 3])              # Array 1D
b = np.array([(1, 2, 3), (4, 5, 6)]) # Array 2D (Matriz)

# Placeholders (Rellenos)
c = np.zeros(5)               # Array de 5 ceros
d = np.ones((2, 3))           # Matriz 2x3 de unos
e = np.eye(4)                 # Matriz identidad de 4x4
f = np.linspace(0, 10, 5)     # 5 valores equiespaciados entre 0 y 10
g = np.arange(0, 10, 2)       # Rango de 0 a 10 con paso de 2
h = np.full((2, 2), 7)        # Matriz 2x2 llena de sietes


print(f"Array a: {a}")
print(f"Array b: {b}")
print(f"Array Array de 5 ceros c: {c}")
print(f"Array Matriz 2x3 de unos d: {d}")
print(f"Array Matriz identidad de 4x4 e: {e}")
print(f"Array 5 valores equiespaciados entre 0 y 10 f: {f}")
print(f"Array Rango de 0 a 10 con paso de 2 g: {g}")
print(f"Array Matriz 2x2 llena de sietes h: {h}")

#2. Inspección del Array Útil para saber con qué tipo de datos estás trabajando.
#a.shape : Dimensiones (filas, columnas).
print(f" Dimensiones (filas, columnas): {a.shape}")
#len(a) : Longitud del array.
print(f" Longitud del array: {len(a)}")

#a.ndim : Número de dimensiones.
print(f" Número de dimensiones: {a.ndim}")

#a.size : Número total de elementos.
print(f" Número total de elementos: {a.size}") 

#a.dtype : Tipo de datos de los elementos.
print(f" Tipo de datos: {a.dtype}") 

#a.astype(int) : Convertir a un tipo de dato específico.
print(f" Convertido a int: {a.astype(int)}")

# 3. Operaciones Matemáticas (Element-wise)
# NumPy aplica la operación a cada elemento individualmente.
# np.add(a, b) o a + b : Suma.
i = np.add(a, b)  # Suma de a con b
print(f"Suma de a con b: {i}")
# np.subtract(a, b) o a - b : Resta.
j = np.subtract(a, b)  # Resta de a con b
print(f"Resta de a con b: {j}")
# np.multiply(a, b) o a * b : Multiplicación.
k = np.multiply(a, b)  # Multiplicación de a con b
print(f"Multiplicación de a con b: {k}")
# np.divide(a, b) o a / b : División.
l = np.divide(a, b)  # División de a con b
print(f"División de a con b: {l}")
# np.exp(a) : Exponencial.
m = np.exp(a)  # Exponencial de a
print(f"Exponencial de a: {m}")
# np.sqrt(a) : Raíz cuadrada.
n = np.sqrt(a)  # Raíz cuadrada de a
print(f"Raíz cuadrada de a: {n}")
# np.dot(a, b) : Producto punto (álgebra lineal).
o = np.dot(a, a)  # Producto punto de a con b
print(f"Producto punto de a con b: {o}")

# 4. Estadística Descriptiva
# Los métodos que más usarás en tu especialización:
# np.mean(a, axis=0) : Media (axis=0 columnas, axis=1 filas).
p = np.mean(a)  # Media de a
print(f"Media de a: {p}")
# np.median(a) : Mediana.
q = np.median(a)  # Mediana de a
print(f"Mediana de a: {q}")
# np.std(a) : Desviación estándar.
r = np.std(a)  # Desviación estándar de a
print(f"Desviación estándar de a: {r}")
# np.var(a) : Varianza.
s = np.var(a)  # Varianza de a
print(f"Varianza de a: {s}")
# np.corrcoef(a) : Coeficiente de correlación.
t = np.corrcoef(a)  # Coeficiente de correlación de a
print(f"Coeficiente de correlación de a: {t}")
# a.min() / a.max() : Valores mínimo y máximo.
u_min = a.min()  # Valor mínimo de a
u_max = a.max()  # Valor máximo de a
print(f"Valor mínimo de a: {u_min}")
print(f"Valor máximo de a: {u_max}")
# a.sum() : Suma total de los elementos.
v = a.sum()  # Suma total de los elementos de a
print(f"Suma total de los elementos de a: {v}")

# 5. Selección y Slicing (Rebanado)
# a[5] : El elemento en el índice 5.
print(f"Elemento en el índice 5 de a: {a[2]}")
# b[1, 2] : Elemento en fila 1, columna 2.
print(f"Elemento en fila 1, columna 2 de b: {b[1, 2]}")
# a[0:2] : Elementos del índice 0 al 1.
print(f"Elementos del índice 0 al 1 de a: {a[0:2]}")
# b[:, 1] : Todos los elementos de la columna 1.
print(f"Todos los elementos de la columna 1 de b: {b[:, 1]}")
# a[a < 5] : Filtro booleano (trae elementos menores a 5).
print(f"Elementos de a menores a 5: {a[a < 5]}")

# 6. Manipulación de Forma
# a.reshape(3, -2) : Cambia la forma (ej. de 1x6 a 3x2).
w = a.reshape(3, -1)  # Cambia la forma de a a 3 filas y el número de columnas se ajusta automáticamente
print(f"Forma de a cambiada a 3 filas: {w}")
# a.flatten() : Colapsa un array 2D a 1D.
x = b.flatten()  # Colapsa b a un array 1D
print(f"Array b colapsado a 1D: {x}")
# np.transpose(a) o a.T : Transponer la matriz (filas por columnas).
y = b.T  # Transponer la matriz b
print(f"Matriz b transpuesta: {y}")
# np.concatenate((a, b)) : Une dos arrays.
z = np.concatenate((a, a))  # Une a con a
print(f"Unión de a con a: {z}")
# np.vstack((a, b)) : Apila verticalmente.
print(f"Apilamiento vertical de a con a: {np.vstack((a, a))}")  
# np.hstack((a, b)) : Apila horizontalmente.
print(f"Apilamiento horizontal de a con a: {np.hstack((a, a))}")

# 7. Generación Aleatoria (np.random)
# np.random.rand(5) : 5 números aleatorios entre 0 y 1.
print(f"5 números aleatorios entre 0 y 1: {np.random.rand(5)}")
# np.random.randn(5) : 5 números de una distribución normal estándar.
print(f"5 números de una distribución normal estándar: {np.random.randn(5)}")
# np.random.randint(0, 10, 5) : 5 enteros aleatorios entre 0 y 9.
print(f"5 enteros aleatorios entre 0 y 9: {np.random.randint(0, 10, 5)}")
# np.random.seed(42) : Fija la semilla para que los resultados sean repetibles.
np.random.seed(42)
print(f"5 números aleatorios con semilla fija: {np.random.rand(5)}")
# Tip de oro: Casi todas las funciones de NumPy tienen un parámetro llamado out. Si quieres ahorrar memoria en datasets gigantes, puedes decirle a NumPy dónde guardar el resultado directamente: np.add(a, b, out=a).
