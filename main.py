<<<<<<< HEAD
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
=======
# Sistema de Monitoreo: Guardian de Infraestructura v1.0

import datetime  # Librería para manejar fecha y hora

# Obtener fecha y hora actual
fecha_hora = datetime.datetime.now()

print("SISTEMA DE MONITOREO - GUARDIAN DE INFRAESTRUCTURA v1.0")
print("Fecha y hora del diagnostico:", fecha_hora)
print()

try:
    # Captura de Parámetros
    id_servidor = input("Ingrese el ID del Servidor socio: ")

    carga_cpu = float(input("Ingrese la carga de CPU socio (%): "))
    temperatura = float(input("Ingrese la temperatura del Rack socio (°C): "))
    consumo_energia = float(input("Ingrese el consumo de energía socio (Watts): "))

    print("\nRESULTADOS DEL DIAGNÓSTICO\n")

    # Control de Energía
    if consumo_energia > 400:
        exceso = consumo_energia - 400
        print(f"[ENERGÍA]: Exceso de consumo detectado: {exceso}W sobre el límite permitido socio.")
    else:
        print("[ENERGÍA]: Consumo dentro del rango permitido socio.")

    # Alerta Crítica
    if temperatura > 75 and carga_cpu > 80:
        print("[PELIGRO CRÍTICO]: Apagado de emergencia inminente socio.")
    elif temperatura > 75 or carga_cpu > 80:
        print("[ADVERTENCIA]: Rendimiento comprometido socio.")
    else:
        print("[ESTADO]: Operación normal socio.")

    # Capacidad de Reserva
    if carga_cpu >= 90:
        capacidad_restante = 100 - carga_cpu
        procesos_adicionales = int(capacidad_restante // 2)
        print(f"[CAPACIDAD]: Puede recibir {procesos_adicionales} procesos adicionales antes de colapsar socio.")
    else:
        print("[CAPACIDAD]: El servidor tiene margen operativo suficiente socio.")

    print(f"\nFIN DEL REPORTE PARA {id_servidor} socio.")

except ValueError:
    print("\n[ERROR]: Entrada inválida. Asegúrese de ingresar valores numéricos correctos socio.")

except Exception as e:
    print("\n[ERROR INESPERADO SOCIO]:", e)
>>>>>>> refs/remotes/origin/main
