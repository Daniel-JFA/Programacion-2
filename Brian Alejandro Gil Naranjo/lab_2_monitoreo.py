id_servidor = str(input("Ingrese el ID del servidor: "))
porcentaje_cpu = float(input("Ingrese el porcentaje de uso de CPU: "))
temp_rack = float(input("Ingrese la temperatura del rack en grados Celsius: "))
consumo_energia = float(input("Ingrese el consumo de energía en W: "))
def exceso_energia(consumo):
    if consumo > 400:
        return "se consumen "+ str(consumo - 400) + " W de más"
    else:
        return "No se consume energía de más"
def alerta_critica(temperatura, cpu_porcentaje):
    if temperatura > 75 and cpu_porcentaje > 80:
        return "[PELIGRO CRÍTICO]: Apagado de emergencia inminente"
    elif temperatura > 75 or cpu_porcentaje > 80:
        return "[ADVERTENCIA]: Rendimiento comprometido"
    else:
        return "[ESTADO]: Operación normal" 
def capacidad_reservada(cpu_porcentaje):
    if cpu_porcentaje > 90:
        return "se pueden recibir " + str((100 - cpu_porcentaje)/2) + "procesos adicionales antes de alcanzar el límite crítico"
    else:
        return "servidor optimo para recibir procesos adicionales"
print("consumo de energía: ")
print(exceso_energia(consumo_energia))
print("alerta crítica: ")
print(alerta_critica(temp_rack, porcentaje_cpu))
print("capacidad reservada: ")
print(capacidad_reservada(porcentaje_cpu))
