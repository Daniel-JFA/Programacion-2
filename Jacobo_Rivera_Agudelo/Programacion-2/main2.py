import os
import random
import time
import math
from datetime import datetime


# ==============================
# UTILIDADES VISUALES
# ==============================

def limpiar_pantalla():
    os.system("cls" if os.name == "nt" else "clear")


def bienvenida():
    limpiar_pantalla()
    print("=" * 60)
    print("🛡️  SISTEMA GUARDIÁN DE INFRAESTRUCTURA v2.1")
    print("=" * 60)
    print("Inicializando módulos de diagnóstico...\n")
    barra_carga()
    limpiar_pantalla()


def barra_carga():
    for i in range(0, 101, 10):
        time.sleep(0.2)
        barras = "█" * (i // 10)
        espacios = "░" * (10 - (i // 10))
        #estas lineas empiezan en 0 hasta 100 y avanzan de 10 en 10 por eso se usa un for y el time.sleep hace una pausa de 0.2 eso crea la animacion de la barra de carga.
        print(f"\rCargando: [{barras}{espacios}] {i}%", end="", flush=True)
        #flush true fuerza a Python a mostrar el texto inmediatamente y la \r hace que el cursor vuelva al inicio de la línea para sobreescribir el texto anterior.
    print("\nSistema listo.\n")
    time.sleep(1)
    #el time.sleep es para pausar el programa por un segundo o lo que yo indique.


# ==============================
# VALIDACIONES
# ==============================

def pedir_entero(mensaje):
    while True:
        try:
            return int(input(mensaje))
        except ValueError:
            print("!! Entrada inválida. Debe ser un número entero.")


def pedir_float(mensaje, minimo=None, maximo=None):
    while True:
        try:
            valor = float(input(mensaje))

            if minimo is not None and valor < minimo:
                print(f"!! El valor no puede ser menor que {minimo}.")
                continue

            if maximo is not None and valor > maximo:
                print(f"!! El valor no puede ser mayor que {maximo}.")
                continue

            return valor

        except ValueError:
            print("!! Entrada inválida. Debe ser un número válido.")


def pedir_nombre(mensaje):
    while True:
        nombre = input(mensaje).strip()

        if not nombre.replace(" ", "").isalpha():
            print("!! El nombre solo debe contener letras.")
        else:
            return nombre


# ==============================
# PROGRAMA PRINCIPAL
# ==============================

def main():
    bienvenida()

    tecnico = pedir_nombre("Nombre del técnico: ")
    cantidad = pedir_entero("Número de servidores a revisar: ")

    servidores = []
    servidores_en_riesgo = []

    limpiar_pantalla()
    print("=== CAPTURA DE DATOS ===\n")

    for i in range(cantidad):
        print(f"\n--- Servidor #{i+1} ---")

        id_servidor = input("ID del servidor: ")
        cpu = pedir_float("Carga CPU (%): ", 0, 100)
        energia = pedir_float("Consumo energía (W): ", 0)

        temperatura = random.randint(40, 60) + int(cpu * 0.6) 
        temperatura = min(temperatura, 120)
        #Estas 2 lineas simulan la temperatura como se pidio en el ejercicio
        #pero yo quise agregarle un poco de realismo haciendo que la temperatura aumente con la carga de CPU, pero sin exceder los 120 grados.

        servidores.append([id_servidor, cpu, temperatura, energia])

    limpiar_pantalla()
    print("=== INICIANDO DIAGNÓSTICO MASIVO ===\n")
    time.sleep(1)

    total_cpu = 0
    total_temp = 0
    total_energia = 0
    mayor_consumo = 0
    servidor_mayor_consumo = ""

    for i, servidor in enumerate(servidores):
        id_servidor, cpu, temperatura, energia = servidor
        razones = []

        print("=" * 50)
        print(f"Servidor #{i+1} - {id_servidor}")
        print("=" * 50)

        print(f"CPU: {cpu}%")
        print(f"Temperatura: {temperatura}°C")
        print(f"Energía: {energia}W")

        total_cpu += cpu
        total_temp += temperatura
        total_energia += energia

        if energia > mayor_consumo:
            mayor_consumo = energia
            servidor_mayor_consumo = id_servidor

        # Control energía
        if energia > 400:
            exceso = energia - 400
            print(f"!! Exceso de energía: {exceso}W")
            razones.append("alto consumo energético")

        # Diagnóstico
        if temperatura > 75 and cpu > 80:
            print("🔴 [PELIGRO CRÍTICO] Apagado inminente.")
            razones.append("temperatura alta")
            razones.append("cpu alta")
        elif temperatura > 75 or cpu > 80:
            print("🟠 [ADVERTENCIA] Rendimiento comprometido.")
            if temperatura > 75:
                razones.append("temperatura alta")
            if cpu > 80:
                razones.append("cpu alta")
        else:
            print("🟢 [ESTADO] Operación normal.")

        # Capacidad de reserva
        if cpu >= 90:
            restante = math.floor((100 - cpu) / 2)
            print(f"Puede recibir {restante} procesos adicionales.")

        if razones:
            servidores_en_riesgo.append((i+1, id_servidor, razones))

        print()

    # ==============================
    # RESUMEN GLOBAL
    # ==============================

    print("\n" + "=" * 60)
    print(" RESUMEN GLOBAL DEL SISTEMA")
    print("=" * 60)

    promedio_cpu = total_cpu / cantidad
    promedio_temp = total_temp / cantidad

    print(f"Promedio CPU general: {promedio_cpu:.2f}%")
    print(f"Promedio Temperatura: {promedio_temp:.2f}°C")
    print(f"Consumo total energía: {total_energia:.2f}W")
    print(f"Servidor con mayor consumo: {servidor_mayor_consumo} ({mayor_consumo}W)")

    print("\n=== SERVIDORES EN RIESGO ===")

    if servidores_en_riesgo:
        for riesgo in servidores_en_riesgo:
            print(riesgo)
    else:
        print("Todos los servidores están en estado normal.")

    print("\nDiagnóstico finalizado.")
    print(f"Técnico responsable: {tecnico}")
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


# ==============================
# CONTROL DE REPETICIÓN
# ==============================

if __name__ == "__main__":
    while True:
        main()
#este if es demasiado importante es para evitar que el programa se ejecute automáticamente si este archivo es importado como un módulo en otro programa, solo se ejecutará si este archivo es el programa principal que se está ejecutando.

        repetir = input("\n¿Desea realizar otro diagnóstico? (s/n): ").strip().lower()
        #strip y lower es para evitar espacios y mayusculas que el usuario pueda ingresar 
    

        if repetir != "s":
            print("\nCerrando sistema...")
            time.sleep(1)
            limpiar_pantalla()
            print("🛡️ Sistema Guardián finalizado correctamente.")
            break

        limpiar_pantalla()