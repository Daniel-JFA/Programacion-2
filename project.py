import os

tecnico = input("Ingrese el nombre del técnico: ")
kilometros = float(input("Ingrese los kilómetros recorridos: "))
voltaje = float(input("Ingrese el voltaje de la batería: "))

km_revision = 10000

os.system('cls')

print("reporte de revisión")
print(f"Técnico: {tecnico}")
print(f"Kilómetros recorridos: {kilometros} km")
print(f"Voltaje de la batería: {voltaje} V")
print("kilometros para la próxima revisión: ", km_revision - kilometros)

if voltaje < 12.5:
    print("La batería necesita ser reemplazada.")
else:
    print("La batería está en buen estado.")
    print("La próxima revisión es en: ", km_revision - kilometros, "km")
    print("se recomienda revisar la batería cada 10000 km o cada 6 meses, lo que ocurra primero.")