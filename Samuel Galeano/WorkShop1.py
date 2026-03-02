cantidad = int(input("¿Cuántos servidores desea registrar?: "))

# Variables acumuladoras
total_cpu = 0
total_temperatura = 0
total_energia = 0
contador_peligro = 0
contador_advertencia = 0
contador_normal = 0

# Variables para servidor más crítico
mayor_indice = -1
servidor_critico = ""

for i in range(cantidad):
    print(f"\nRegistro del servidor {i+1}:")
    id_servidor = input("Ingrese el ID del Servidor: ")
    cpu = float(input("Ingrese la carga de CPU: "))
    temperatura = float(input("Ingrese la temperatura del estante: "))
    energia = float(input("Ingrese el consumo de energía: "))

    # Acumuladores
    total_cpu += cpu
    total_temperatura += temperatura
    total_energia += energia

    # Índice de criticidad
    indice = cpu + temperatura

    if indice > mayor_indice:
        mayor_indice = indice
        servidor_critico = id_servidor

    # Control de energía
    if energia > 400:
        exceso = energia - 400
        print(f"Control de Energía: Exceso de {exceso}W sobre el límite permitido.")
    else:
        print("Control de Energía: Consumo dentro del rango permitido.")

    # Estado del servidor
    if temperatura > 75 and cpu > 80:
        print("Peligro: Apagado de emergencia inminente.")
        contador_peligro += 1
    elif temperatura > 75 or cpu > 80:
        print("Advertencia: Rendimiento comprometido.")
        contador_advertencia += 1
    else:
        print("Estado: Operación normal.")
        contador_normal += 1

    # Capacidad restante
    if cpu >= 90:
        capacidad_restante = 100 - cpu
        procesos_adicionales = int(capacidad_restante // 2)
        print(f"Capacidad de Reserva: Puede recibir {procesos_adicionales} procesos adicionales antes de colapsar.")
    else:
        print("Capacidad de Reserva: El servidor aún tiene margen operativo suficiente.")

print("\nReporte general: ")
print(f"Promedio CPU: {total_cpu / cantidad:.2f}%")
print(f"Promedio Temperatura: {total_temperatura / cantidad:.2f}°C")
print(f"Energía Total Consumida: {total_energia}W")
print(f"\nServidores en Peligro: {contador_peligro}")
print(f"Servidores en Advertencia: {contador_advertencia}")
print(f"Servidores en Estado Normal: {contador_normal}")
print(f"\nServidor más crítico: {servidor_critico}")
print(f"Índice de criticidad más alto: {mayor_indice}")