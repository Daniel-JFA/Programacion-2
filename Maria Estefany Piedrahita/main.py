import os

IDs = input("Ingrese ID del servidor: ")
Carga = float(input("Ingrese carga de CPU: "))
Temp = float(input("Ingrese Temperatura del Rack en celsius: "))
Ce=float(input("ingrese el consumo de energia en watts: "))

os.system("cls")
if Ce > 400:
    exceso = Ce - 400
    print("El exceso de energia que se está consumiendo es de:",exceso)
    
if Temp > 75 and Carga >80:
    print("[PELIGRO CRÍTICO]: Apagado de emergencia inminente")
elif Temp >75:
    print("[ADVERTENCIA]: Rendimiento comprometido")
elif Carga > 80:
    print("[ADVERTENCIA]: Rendimiento comprometido")
else:
    print("[ESTADO]: Operación normal")

if Carga >= 90:
    porcentajeFaltante=100-Carga
    procesos=int(porcentajeFaltante/2)
    print("Procesos adicionales antes de colapsar: ", procesos)
