#Ejercicio 1
a = 13
b = 15
print (f"La suma entre {a} y {b} es igual a {a+b}")

#Ejercicio 2
i = int(input("Ingrese un número para saber si es par o impar: "))
if i % 2 == 0:
    print(f"El número {i} es par")
else:
    print(f"El número {i} es impar")

#Ejercicio 3
def fizzbuzz():
    for i in range(1,101):
        if i % 3 == 0 and i % 5 == 0:
            print(f"{i} FizzBuzz")
        elif i % 3 == 0:
            print(f"{i} Fizz")
        elif i % 5 == 0:
            print(f"{i} Buzz")
        else:
            print(i)
fizzbuzz()

#Ejercicio 4
n = int(input("Ingrese un número para saber su factorial: "))
resultado = 1
for i in range(1, n+1):
    resultado *= i
print(f"El numero factorial de {n} es: {resultado} ")

#Ejercicio 5
def es_palindromo(texto):
    texto = texto.lower().replace(" "," ")
    return texto == texto[::-1]
frase = input("Ingrese una palabra o frase para saber si es palindromo: ")
if es_palindromo(frase):
    print("Esta palabra o texto es un palindromo")
else:
    print("Esta palabra o texto no es un palindromo")

#Ejercicio 6
def encontrar_maximo(lista):
    maximo = lista[0]
    for numero in lista:
        if numero > maximo:
            maximo = numero
    return maximo

numeros = input("Ingrese los números separados por espacio: ")
lista_numeros = [int(num) for num in numeros.split()]
print("El número máximo es:", encontrar_maximo(lista_numeros))

#Ejercicio 7
def invertir_cadena(texto):
    return texto[::-1]

frase = input("Ingrese un texto para invertir: ")
resultado = invertir_cadena(frase)
print("Texto invertido:", resultado)

#Ejercicio 8
def contar_vocales(texto):
    vocales = "aeiou"
    contador = 0
    for letra in texto.lower():
        if letra in vocales:
            contador += 1
    return contador

frase = input("Ingrese un texto para contar sus vocales: ")
resultado = contar_vocales(frase)
print("La cantidad de vocales es:", resultado)

#Ejercicio 9
def es_primo(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def primos_hasta(limite):
    primos = []
    for numero in range(2, limite + 1):
        if es_primo(numero):
            primos.append(numero)
    return primos

limite = int(input("Ingrese un número límite: "))
resultado = primos_hasta(limite)
print("Los números primos hasta", limite, "son:")
print(resultado)

#Ejercicio 10
def fibonacci(limite):
    secuencia = [0, 1]
    while secuencia[-1] + secuencia[-2] <= limite:
        secuencia.append(secuencia[-1] + secuencia[-2])
    return secuencia

limite = int(input("Ingrese el número límite para la serie Fibonacci: "))
resultado = fibonacci(limite)
print("Serie Fibonacci hasta", limite, ":")
print(resultado)