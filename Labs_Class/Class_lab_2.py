tecnico = input("Ingrese nombre del tecnico: ")
n = int(input("Ingrese el numero de motos a revisar: "))
motos = []

for i in range(n):
    print(f"\nMoto #{i+1}")
    km = float(input("Ingrese los kilometros recorridos: "))
    v = float(input("Ingrese el voltaje de la bateria: "))
    motos.append([km, v, 10000 - km])

print("\nReporte de Revision")
print("Tecnico:", tecnico)
por_revisar = []
for i, m in enumerate(motos, 1):
    razones = []
    if m[1] < 12.5:
        razones.append("bateria baja")
    if m[2] <= 0:
        razones.append("kilometraje de revision vencido")
    if razones:
        por_revisar.append((i, razones))

if por_revisar:
    print("\nMotos que se deben revisar:")
    for numero, razones in por_revisar:
        print(f"La moto {numero} se debe revisar por: {', '.join(razones)}.")
else:
    print("\nNinguna moto se debe revisar.")
