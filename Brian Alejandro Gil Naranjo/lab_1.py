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
def maximo(array):
    if not array:
        return None  # Retorna None si el array está vacío
    max_num = array[0]
    for num in array:
        if num > max_num:
            max_num = num
    return max_num
numeros = [3, 7, 2, 9, 5]
print(maximo(numeros))  # 9

# Ejercicio 7: Invertir una Cadena
# Descripción: Escribe una función que tome una cadena de texto y devuelva la cadena invertida.
def invertir_cadena(cadena):
    return cadena[::-1] 
print(invertir_cadena("Hola Mundo"))  # "odnuM aloH"

# Ejercicio 8: Contar Vocales en una Cadena
# Descripción: Escribe una función que tome una cadena de texto y cuente el número de vocales (a, e, i, o, u).
def contar_vocales(cadena):
    vocales = "aeiouAEIOU"
    contador = 0
    for char in cadena:
        if char in vocales:
            contador += 1
    return contador
print(contar_vocales("Hola Mundo"))  # 4

# Ejercicio 9: Encontrar Números Primos
# Descripción: Escribe una función que encuentre todos los números primos hasta un número dado.
def es_primo(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True 
def numeros_primos_hasta(n):
    primos = []
    for i in range(2, n + 1):
        if es_primo(i):
            primos.append(i)
    return primos
print(numeros_primos_hasta(20))  # [2, 3, 5, 7, 11, 13, 17, 19]

# Ejercicio 10: Generar una Secuencia Fibonacci
# Descripción: Escribe una función que genere una secuencia Fibonacci hasta un número dado.
def fibonacci_hasta(n):
    secuencia = []
    a, b = 0, 1
    while a <= n:
        secuencia.append(a)
        a, b = b, a + b
    return secuencia
print(fibonacci_hasta(100))  #

