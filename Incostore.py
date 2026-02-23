import tkinter as tk
from tkinter import messagebox

# ----------------------------
# VARIABLES GLOBALES
# ----------------------------

usuarios = []
usuario_activo = None
carrito = []
total_compra = 0

# ----------------------------
# FUNCIONES CARRITO
# ----------------------------

def agregar_producto(nombre, precio):
    global total_compra

    respuesta = messagebox.askyesno(
        "Confirmar",
        f"¿Desea añadir {nombre}?\nPrecio: ${precio}"
    )

    if respuesta:
        carrito.append({"nombre": nombre, "precio": precio})
        lista_box.insert(tk.END, f"{nombre} - ${precio}")
        total_compra += precio
        label_total.config(text=f"Total: ${total_compra}")


def eliminar_producto():
    global total_compra

    seleccion = lista_box.curselection()
    if not seleccion:
        return

    indice = seleccion[0]
    producto = carrito[indice]

    total_compra -= producto["precio"]
    label_total.config(text=f"Total: ${total_compra}")

    lista_box.delete(indice)
    carrito.pop(indice)

def realizar_compra():
    global total_compra, carrito

    if total_compra == 0:
        messagebox.showwarning("Carrito vacío", "No hay productos en la lista de compras.")
        return

    confirmar = messagebox.askyesno(
        "Confirmar Compra",
        f"Total a pagar: ${total_compra}\n\n¿Desea continuar con la compra?"
    )

    if confirmar:
        messagebox.showinfo("Compra Exitosa", "La compra se realizó correctamente.")

        # Limpiar carrito
        carrito.clear()
        lista_box.delete(0, tk.END)

        total_compra = 0
        label_total.config(text="Total: $0")

# ----------------------------
# REGISTRO
# ----------------------------

def registrar():
    global usuario_activo

    nombre = entry_nombre.get()
    codigo = entry_codigo.get()
    clave = entry_clave.get()

    if nombre == "":
        messagebox.showerror("Error", "Nombre obligatorio")
        return

    if not (len(codigo) == 11 and codigo.isdigit()):
        messagebox.showerror("Error", "Código debe tener 11 dígitos")
        return

    if not (len(clave) == 4 and clave.isdigit()):
        messagebox.showerror("Error", "Clave debe tener 4 dígitos")
        return

    usuario = {
        "nombre": nombre,
        "codigo": codigo,
        "clave": clave
    }

    usuarios.append(usuario)
    usuario_activo = usuario

    abrir_menu()


# ----------------------------
# MENÚ PRINCIPAL
# ----------------------------

def abrir_menu():
    ventana_registro.withdraw()

    global ventana_menu
    ventana_menu = tk.Toplevel()
    ventana_menu.title("Menú Principal")
    ventana_menu.geometry("500x300")

    tk.Label(
        ventana_menu,
        text=f"Bienvenido, {usuario_activo['nombre']}",
        font=("Arial", 16)
    ).grid(row=0, column=0, columnspan=3, pady=20)

    tk.Button(ventana_menu, text="Panadería", width=15, command=abrir_panaderia).grid(row=1, column=0, padx=10)
    tk.Button(ventana_menu, text="Almuerzos", width=15, command=abrir_almuerzos).grid(row=1, column=1, padx=10)
    tk.Button(ventana_menu, text="Frutería", width=15, command=abrir_fruteria).grid(row=1, column=2, padx=10)


# ----------------------------
# CREAR TIENDA BASE
# ----------------------------

def crear_tienda(titulo, productos_dict):
    global lista_box, label_total

    ventana_menu.withdraw()

    ventana_tienda = tk.Toplevel()
    ventana_tienda.title(titulo)
    ventana_tienda.geometry("600x500")

    tk.Label(ventana_tienda, text=titulo, font=("Arial", 18)).grid(row=0, column=0, columnspan=4, pady=10)

    fila = 1
    columna = 0

    for nombre, precio in productos_dict.items():
        tk.Button(
            ventana_tienda,
            text=f"{nombre}\n${precio}",
            width=15,
            height=2,
            command=lambda n=nombre, p=precio: agregar_producto(n, p)
        ).grid(row=fila, column=columna, padx=10, pady=10)

        columna += 1
        if columna > 3:
            columna = 0
            fila += 1

    # ----- CARRITO -----

    tk.Label(ventana_tienda, text="Lista de Compras", font=("Arial", 14)).grid(row=fila+1, column=0, columnspan=4)

    lista_box = tk.Listbox(ventana_tienda, width=50)
    lista_box.grid(row=fila+2, column=0, columnspan=4, pady=10)

    label_total = tk.Label(ventana_tienda, text=f"Total: ${total_compra}", font=("Arial", 12))
    label_total.grid(row=fila+3, column=0, columnspan=4)

    tk.Button(
        ventana_tienda,
        text="Eliminar Producto",
        command=eliminar_producto
    ).grid(row=fila+4, column=0, columnspan=4, pady=5)
    tk.Button(
    ventana_tienda,
    text="Comprar",
    bg="green",
    fg="white",
    width=20,
    command=realizar_compra
).grid(row=fila+5, column=0, columnspan=4, pady=5)

    tk.Button(
    ventana_tienda,
    text="Volver",
    command=lambda: volver_al_menu(ventana_tienda)
).grid(row=fila+6, column=0, columnspan=4, pady=10)


def volver_al_menu(ventana_actual):
    ventana_actual.destroy()
    ventana_menu.deiconify()


# ----------------------------
# TIENDAS ESPECÍFICAS
# ----------------------------

def abrir_panaderia():
    productos = {
        "Pan francés": 1000,
        "Croissant": 2500,
        "Donut": 2000,
        "Pan integral": 1500,
        "Torta": 3500,
        "Galletas": 1200,
        "Muffin": 2800,
        "Empanada": 3000
    }
    crear_tienda("Panadería", productos)


def abrir_almuerzos():
    productos = {
        "Ejecutivo": 12000,
        "Vegetariano": 11000,
        "Especial": 14000
    }
    crear_tienda("Almuerzos del Día", productos)


def abrir_fruteria():
    productos = {
        "Manzana": 1500,
        "Banano": 1000,
        "Fresa": 3000,
        "Mango": 2500,
        "Piña": 4000,
        "Uvas": 3500
    }
    crear_tienda("Frutería", productos)


# ----------------------------
# VENTANA REGISTRO
# ----------------------------

ventana_registro = tk.Tk()
ventana_registro.title("Registro - Sistema Universidad")
ventana_registro.geometry("400x300")

tk.Label(ventana_registro, text="Nombre").pack()
entry_nombre = tk.Entry(ventana_registro)
entry_nombre.pack()

tk.Label(ventana_registro, text="Código (11 dígitos)").pack()
entry_codigo = tk.Entry(ventana_registro)
entry_codigo.pack()

tk.Label(ventana_registro, text="Clave (4 dígitos)").pack()
entry_clave = tk.Entry(ventana_registro, show="*")
entry_clave.pack()

tk.Button(ventana_registro, text="Ingresar", command=registrar).pack(pady=20)

ventana_registro.mainloop()
