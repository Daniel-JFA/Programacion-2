# This is a sample Python script.
# SUma de 2 numeros mediante funcion
def suma (a, b):
    return a + b
print(suma(5, 3))

#Numero por o impar
def es_par(numero):
    return numero % 2 == 0

print(es_par(4))  # True
print(es_par(5))  # False

#Ejercicio 3  FizzBuzz
def fizz_buzz(n):
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)

fizz_buzz(15)

# Ejercicio 4: Factorial
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
    
print(factorial(9))  # 120

from math import factorial as math_factorial
print(math_factorial(9))  # 120

# Ejercicio 5: Palindromo
def es_palindromo(cadena):
    cadena = cadena.replace(" ", "").lower()  # Eliminar espacios y convertir a minúsculas
    return cadena == cadena[::-1]  # Comparar la cadena con su reverso          
print(es_palindromo("Anita lava la tina"))  # True
print(es_palindromo("Hola"))  # False   

# Ejercicio 6: Encontrar el Máximo en un Array
# Descripción: Escribe una función que tome un array de números y devuelva el número máximo.

# Ejercicio 7: Invertir una Cadena
# Descripción: Escribe una función que tome una cadena de texto y devuelva la cadena invertida.

# Ejercicio 8: Contar Vocales en una Cadena
# Descripción: Escribe una función que tome una cadena de texto y cuente el número de vocales (a, e, i, o, u).

# Ejercicio 9: Encontrar Números Primos
# Descripción: Escribe una función que encuentre todos los números primos hasta un número dado.

# Ejercicio 10: Generar una Secuencia Fibonacci
# Descripción: Escribe una función que genere una secuencia Fibonacci hasta un número dado.

#Strings

comillasSimples = 'Simples'
comillasDobles = "Dobles"
comillasTriples = '''Triples'''

print(comillasSimples)
print(comillasDobles)
print(comillasTriples)

#Números
a=1
b=3.14
c=5+2j

print(a)
print(b)
print(c)

#Listas
lista={1,2,3,4,5}
print(lista)

#tupla
tupla=("a","b","c")
print(tupla)

#Diccionario
diccionario={
    "Nombre":"Ari",
    "Edad":34,
    "Ciudad":"México"
}
print(diccionario)

#Booleanos
booleanoVerdadero=True
booleanoFalso=False
print(booleanoVerdadero)
print(booleanoFalso)