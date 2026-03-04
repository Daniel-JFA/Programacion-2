import random
import math
import os

def limpiar():
   if os.name == "nt":      
    os.system("cls")
   else:                    
    os.system("clear")
def linea():
    print(" " * 70)

def titulo(texto):
    linea()
    print(texto)
    linea()

Nombre=input("ingrese nombre del tecnico: ")
num=int(input("ingrese numero de servidores a revisar: "))


servidores=[]
servidores_en_riesgo=[]

limpiar()
titulo("Revision De Servidores")

for i in range(num):
 print(f"Servidor {i+1}:")
 IDs = input("Ingrese ID del servidor: ")
 Carga = float(input("Ingrese carga de CPU: "))
 Ce=float(input("ingrese el consumo de energia en watts: "))

 servidores.append([IDs, Carga,Ce])

 Temp=random.randint(40,120)   
 Temp2 = 0                     

 linea()

 if Ce > 400:
    exceso = Ce - 400
    print(f"El exceso de energia que se está consumiendo es de: {exceso}")
    
 else:
   print("El consumo de energia es adecuado")


 if Temp > 75 and Carga >80:
    print("[PELIGRO CRÍTICO]: Apagado de emergencia inminente")
    Temp2 = Temp
 elif Temp >75:
    print("[ADVERTENCIA]: Rendimiento comprometido")
    Temp2 = Temp
 elif Carga > 80:
    print("[ADVERTENCIA]: Rendimiento comprometido")
    Temp2 = Temp
 else:
    print("[ESTADO]: Operación normal")

 if Carga >= 90:
    porcentajeFaltante=100-Carga
    procesos=math.ceil(porcentajeFaltante/2)
    print("Procesos adicionales antes de colapsar: ", procesos)
 else:
    print("Capacidad de reserva estable")

 print()
 if Ce > 400 and Temp2==Temp and Carga >80:
   servidores_en_riesgo.append([IDs, Carga, Ce, Temp])

 elif Ce > 400 or Temp2==Temp or Carga >80:
      servidores_en_riesgo.append([IDs, Carga, Ce, Temp])
linea()
print()
titulo("Resumen final")

if servidores_en_riesgo:
    print("Servidores en riesgo: ")
    linea()
    for servidor in servidores_en_riesgo:
       print("ID:", servidor[0]," ", "Carga:", servidor[1]," ", "Consumo de energía:", servidor[2]," ", "Temperatura:", servidor[3]," ")
       linea()
else:
    print("Todos los servidores están estables")
    linea()