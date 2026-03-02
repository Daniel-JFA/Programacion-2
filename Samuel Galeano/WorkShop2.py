import random
import math

print(" Monitoreo ")
#Captura General
tecnico = input("Nombre del técnico: ")
cantidad_servidores = int(input("Número de servidores a revisar: "))
# Matriz principal
servidores = []
servidores_en_riesgo = []
print("Servidores: ")

for i in range(cantidad_servidores):
    print(f"Servidor #{i+1} ")
    id_servidor = input("ID del Servidor: ")
    # Validacion CPU
    cpu = float(input("Carga de CPU: "))
    while cpu < 0 or cpu > 100:
        print("Error: Debe estar entre 0 y 100.")
        cpu = float(input("Carga de CPU: "))

    # Validación de Energía
    energia = float(input("Consumo de Energía: "))
    while energia < 0:
        print("Error: La energía no puede ser negativa.")
        energia = float(input("Consumo de Energía: "))

    # Temperatura
    temperatura = random.randint(40, 120)
    servidores.append([id_servidor, cpu, temperatura, energia])

print("Diagnostico: ")
# Evaluación
for i in range(len(servidores)):
    id_servidor = servidores[i][0]
    cpu = servidores[i][1]
    temperatura = servidores[i][2]
    energia = servidores[i][3]
    motivos_riesgo = []
    print(f"Evaluando Servidor #{i+1} - {id_servidor}")
    print(f"Cpu: {cpu}% - Temp: {temperatura}°C - Energía: {energia}W")
    #Energía
    if energia > 400:
        exceso = energia - 400
        print(f"Energía: Exceso de {exceso}W")
        motivos_riesgo.append("Energía alta")
    else:
        print("Energía: Consumo permitido.")

    #Estado general
    if temperatura > 75 and cpu > 80:
        print("El servidor está en una situación muy peligrosa y podría apagarse pronto.")
        motivos_riesgo.append("Temperatura alta")
        motivos_riesgo.append("Cpu alta")

    elif temperatura > 75 or cpu > 80:
        print("Temperatura y Cpu alta")

        if temperatura > 75:
            motivos_riesgo.append("Temperatura alta")
        if cpu > 80:
            motivos_riesgo.append("Cpu alta")

    else:
        print("En estado normal")

    #Margen Operativo
    if cpu >= 100:
        print("Servidor saturado al 100%.")
        motivos_riesgo.append("Cpu al 100%")

    elif cpu >= 90:
        capacidad_restante = 100 - cpu
        procesos_adicionales = math.floor(capacidad_restante / 2)
        print(f"Margen operativo: Puede recibir {procesos_adicionales} procesos adicionales.")

    #Guardar servidores
    if len(motivos_riesgo) > 0:
        servidores_en_riesgo.append((i+1, id_servidor, motivos_riesgo))
#Ultima parte
print("Resumen del monitoreo")
print(f"Responsable: {tecnico}")
print(f"Servidores Evaluados: {cantidad_servidores}")
print(f"Servidores en Riesgo: {len(servidores_en_riesgo)}")

if len(servidores_en_riesgo) > 0:
    print("Lista de Servidores en Riesgo:")
    for servidor in servidores_en_riesgo:
        print(f"Servidor #{servidor[0]} - {servidor[1]} - Motivos: {', '.join(servidor[2])}")
else:
    print("Todos los servidores están en estado normal.")