import os

reportes = []

for i in range(3):
    print(f"\n--- Ingreso de datos del Servidor {i+1} ---")
    
    id_servidor = input("Ingrese el ID del Servidor: ")
    cpu = float(input("Ingrese la Carga de CPU (%): "))
    temperatura = float(input("Ingrese la Temperatura del Rack (°C): "))
    energia = float(input("Ingrese el Consumo de Energía (W): "))

    if energia > 400:
        exceso = energia - 400
        mensaje_energia = f"Exceso de energia: {exceso} W por encima del limite permitido."
    else:
        mensaje_energia = "Consumo de energia dentro del rango permitido."

    if temperatura > 75 and cpu > 80:
        estado = "[PELIGRO CRITICO]: Apagado de emergencia inminente."
    elif temperatura > 75 or cpu > 80:
        estado = "[ADVERTENCIA]: Rendimiento comprometido."
    else:
        estado = "[ESTADO]: Operacion normal."

    if cpu >= 90:
        capacidad_restante = 100 - cpu
        procesos_adicionales = int(capacidad_restante // 2)
        mensaje_capacidad = f"Puede recibir {procesos_adicionales} procesos adicionales antes de colapsar."
    else:
        mensaje_capacidad = "El servidor aun tiene capacidad disponible."

    reportes.append({
        "ID": id_servidor,
        "CPU": cpu,
        "Temperatura": temperatura,
        "Energia": energia,
        "EnergiaMensaje": mensaje_energia,
        "Estado": estado,
        "Capacidad": mensaje_capacidad
    })

os.system("cls")

print(" REPORTE GENERAL DEL SISTEMA ")

for i, reporte in enumerate(reportes):
    print(f"\n--- Servidor {i+1} ---")
    print("ID del Servidor:", reporte["ID"])
    print("Carga de CPU:", reporte["CPU"], "%")
    print("Temperatura del Rack:", reporte["Temperatura"], "°C")
    print("Consumo de Energia:", reporte["Energia"], "W")
    print("\nControl de Energia")
    print(reporte["EnergiaMensaje"])
    print("\nEstado del Servidor")
    print(reporte["Estado"])
    print("\nCapacidad de Reserva")
    print(reporte["Capacidad"])