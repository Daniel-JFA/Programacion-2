id_servidor = input("Ingrese el ID del Servidor: ")
cpu = float(input("Ingrese la carga de CPU: "))
temperatura = float(input("Ingrese la temperatura del estante: "))
energia = float(input("Ingrese el consumo de energía: "))

if energia > 400:
    exceso = energia - 400
    print(f"Control de Energía: Exceso de {exceso} W sobre el límite permitido.")
else:
    print("Control de Energía: Consumo dentro del rango permitido.")

if temperatura > 75 and cpu > 80:
    print("Peligro: Apagado de emergencia inminente.")
elif temperatura > 75 or cpu > 80:
    print("Advertencia: Rendimiento comprometido.")
else:
    print("Estado: Operación normal.")

if cpu >= 90:
    capacidad_restante = 100 - cpu
    procesos_adicionales = int(capacidad_restante // 2)
    print(f"Capacidad de Reserva: Puede recibir {procesos_adicionales} procesos adicionales antes de colapsar.")
else:
    print("Capacidad de Reserva: El servidor aún tiene margen operativo suficiente.")
