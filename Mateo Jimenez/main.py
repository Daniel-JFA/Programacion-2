import os

# Ingresar los datos
id_servidor = input("Ingrese el ID del Servidor: ")
cpu = float(input("Ingrese la Carga de CPU (%): "))
temperatura = float(input("Ingrese la Temperatura del Rack (°C): "))
energia = float(input("Ingrese el Consumo de Energía (W): "))

os.system("cls")

# Reporte o informe
print("Reporte del Sistema de Monitoreo")
print("ID del Servidor: ", id_servidor)
print("Carga de CPU: ", cpu, "%")
print("Temperatura del Rack: ", temperatura, "°C")
print("Consumo de Energia: ", energia, "W")

print("\nControl de Energia")
if energia > 400:
    exceso = energia - 400
    print("Exceso de energia:", exceso, "W por encima del limite permitido.")
else:
    print("Consumo de energia dentro del rango permitido.")

print("\nEstado del Servidor")
if temperatura > 75 and cpu > 80:
    print("[PELIGRO CRITICO]: Apagado de emergencia inminente.")
elif temperatura > 75 or cpu > 80:
    print("[ADVERTENCIA]: Rendimiento comprometido.")
else:
    print("[ESTADO]: Operacion normal.")

print("\nCapacidad de Reserva")
if cpu >= 90:
    capacidad_restante = 100 - cpu
    procesos_adicionales = int(capacidad_restante // 2)
    print("Puede recibir", procesos_adicionales, "procesos adicionales antes de colapsar.")
else:
    print("El servidor aun tiene capacidad disponible.")
    
