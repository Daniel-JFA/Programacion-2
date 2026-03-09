import math
import random

def main():
    print("Sistema de Monitoreo")
    Nombre_Del_Tecnico = input("Ingrese el nombre del técnico: ")
    while True:
        try:
            Numero_de_Servidores= int(input("Ingrese el número de servidores: "))
            break
        except ValueError:
            print("Entrada no válida. Por favor, ingrese un número entero.")
        
    servidores = []
    print(f"iniciando captura de datos para los {Numero_de_Servidores} servidores...")
    for i in range(Numero_de_Servidores):
        print(f"Servidor {i+1}:")
        id_servidor = input("Ingrese el ID del servidor: ")
        while True:
            try:
                porcentaje_cpu = float(input("Ingrese el porcentaje de uso de CPU: "))
                if 0 <= porcentaje_cpu <= 100:
                    break
                else:
                    print("Porcentaje de CPU debe estar entre 0 y 100.")    
            except ValueError:
                print("Porcentaje de CPU debe ser un número válido.")
        while True:
            try:
                Consumo_de_Energia = float(input("Ingrese el consumo de energía en W: "))
                if Consumo_de_Energia >= 0:
                    break
                else:
                    print("El consumo de energía debe ser un número positivo.")
            except ValueError:
                print("Consumo de energía debe ser un número válido.")
        Temperatura_Rack= random.randint(40,120)
        fila_servidor = [id_servidor,porcentaje_cpu,Temperatura_Rack,Consumo_de_Energia]
        servidores.append(fila_servidor)
        print(f"\nDatos Capturados para el servidor {id_servidor}: \n")

    servidores_en_riesgo = []
    for indice, srv in enumerate(servidores):
        razones_de_riesgo = []
        id_servidor, porcentaje_cpu, Temperatura_Rack, Consumo_de_Energia = srv
        print(f"\nServidor {id_servidor}: CPU={porcentaje_cpu}%, Temperatura={Temperatura_Rack}°C, Consumo={Consumo_de_Energia}W")
        if Consumo_de_Energia > 400:
            exceso_energia = Consumo_de_Energia - 400
            print(f"\nAlerta: El servidor {id_servidor} tiene un consumo de energía elevado de {exceso_energia}W por encima del umbral de 400W.")
            razones_de_riesgo.append("Consumo de energía elevado")
        if porcentaje_cpu > 80 and Temperatura_Rack > 75:
            razones_de_riesgo.append("Alto uso de CPU y temperatura elevada")
            print(f"\nAlerta Crítica: El servidor {id_servidor} está en riesgo de apagado de emergencia debido a un alto uso de CPU y temperatura.")
        elif porcentaje_cpu > 80 or Temperatura_Rack > 75:
            print(f"\nAlerta: El servidor {id_servidor} tiene un rendimiento comprometido debido a un alto uso de CPU o temperatura.")
            if porcentaje_cpu > 80:
                razones_de_riesgo.append("Alto uso de CPU")
            if Temperatura_Rack > 75:
                razones_de_riesgo.append("Temperatura elevada")
        else:
            print(f"\nEl servidor {id_servidor} está operando normalmente.")
        if porcentaje_cpu > 90:
            capacidad_restante = 100 - porcentaje_cpu
            procesos_restantes = math.floor(capacidad_restante / 2)
            print(f"\nEl servidor {id_servidor} puede recibir {capacidad_restante:.2f}% de procesos adicionales antes de alcanzar el límite crítico.")
        if razones_de_riesgo:
            servidores_en_riesgo.append((id_servidor, razones_de_riesgo))
    if servidores_en_riesgo:
        print("\nResumen de Servidores")
        print("-"*60)
        for item in servidores_en_riesgo:
            id_servidor, lista_razones = item
            print(f"\nServidor {id_servidor} está en riesgo por las siguientes razones: {', '.join(lista_razones)}")
    else:
        print("\nTodos los servidores están operando normalmente.")

if __name__ == "__main__":
    main()