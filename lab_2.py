
#https://github.com/DJFA-Dev/djfa-dev-classroom-4270f2-the-data-center-guardian-The-Data-Center-Guardian-1
import os

#inngresar el nombre datos

tecnico = input("Ingrese nombre del tecnico: ")
kilometros = float(input("Ingrese los kilometros recorridos: "))
voltaje = float(input("Ingrese el voltaje de la bateria: "))

km_revision = 10000 - kilometros

os.system("cls")

#Reporte o informe
print("Reporte de Revision")
print("Tecnico: ", tecnico) 
print("Kilometros recorridos: ", kilometros)
print("Voltaje de la bateria: ", voltaje)

if voltaje < 12.5:
    print("La bateria esta baja, se recomienda cambiarla.")
else:    
    print("La bateria esta en buen estado.")   
    print("Se recomienda revisar la bateria cada 6 meses.") 


print("Kilometros restantes para revision: ", km_revision)
