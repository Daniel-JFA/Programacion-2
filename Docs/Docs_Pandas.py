import pandas as pd

# Crear un DataFrame (Tabla)
df = pd.DataFrame({
    'Edad': [25, 30, 22, 35],
        'Nombre': ['Ana', 'Juan', 'Luis', 'Marta'],
            'Sueldo': [2500, 3100, 2000, 4000]
            })

            # Cargar datos externos
            df = pd.read_csv('archivo.csv')    # Desde CSV
            df = pd.read_excel('archivo.xlsx') # Desde Excel

#2. Inspección Rápida (Exploración)
# Antes de analizar, necesitas ver qué hay dentro:
# df.head(5) : Ver las primeras 5 filas.
df.head(3) # Ver las primeras 3 filas.
# df.tail(3) : Ver las últimas 3 filas.
df.tail(3) # Ver las últimas 3 filas.
# df.info() : Resumen de tipos de datos y valores nulos (¡Vital!).
df.info() # Resumen de tipos de datos y valores nulos.
# df.shape : Devuelve (filas, columnas).
df.shape # Devuelve (filas, columnas).
# df.columns : Lista los nombres de todas las columnas.
df.columns # Lista los nombres de todas las columnas.
# df['Columna'].unique() : Valores únicos de una columna.
df['Nombre'].unique() # Valores únicos de la columna 'Nombre'.
# 3. Estadística Descriptiva en Pandas
# Pandas hace el trabajo sucio por ti:
# df.describe() : Genera media, desviación, min, max y cuartiles de todas las columnas numéricas.
df.describe() # Genera media, desviación, min, max y cuartiles de todas las columnas numéricas.
# df['Columna'].mean() : Media de una columna específica.
df['Edad'].mean() # Media de la columna 'Edad'.
# df['Columna'].median() : Mediana.
df['Sueldo'].median() # Mediana de la columna 'Sueldo'.
# df['Columna'].mode() : Moda.
df['Nombre'].mode() # Moda de la columna 'Nombre'.
# df['Columna'].value_counts() : Cuenta cuántas veces aparece cada valor (ideal para variables categóricas).
df['Nombre'].value_counts() # Cuenta cuántas veces aparece cada nombre en la columna 'Nombre'.
# 4. Selección y Filtrado
# Por Columna: df['Nombre'] o df[['Nombre', 'Sueldo']]  
df['Nombre'] # Selección de la columna 'Nombre'.
df[['Nombre', 'Sueldo']] # Selección de las columnas 'Nombre' y 'Sueldo'.
# Por Índice/Posición: df.iloc[0:5] (Filas de la 0 a la 4).
df.iloc[0:3] # Filas de la 0 a la 2.
# Por Condición (Filtros): * df[df['Edad'] > 30] : Solo personas mayores de 30.
df[df['Edad'] > 30] # Solo personas mayores de 30.
# df[(df['Edad'] > 20) & (df['Sueldo'] < 3000)] : Filtros múltiples.
df[(df['Edad'] > 20) & (df['Sueldo'] < 3000)] # Filtros múltiples: personas mayores de 20 con sueldo menor a 3000.
# 5. Limpieza de Datos (Data Wrangling)
# Los datos del mundo real nunca están perfectos:
# df.isnull().sum() : Cuenta cuántos nulos hay por columna.
df.isnull().sum() # Cuenta cuántos nulos hay por columna.
# df.dropna() : Elimina filas con cualquier valor nulo. 
df.dropna() # Elimina filas con cualquier valor nulo.
# df.fillna(0) : Rellena los nulos con 0 (o con la media: df.fillna(df.mean())).
df.fillna(0) # Rellena los nulos con 0.
# df.replace('Viejo', 'Nuevo') : Reemplaza valores específicos.
df.replace('Ana', 'Ana María') # Reemplaza 'Ana' por 'Ana María' en la columna 'Nombre'.
# df.rename(columns={'Viejo': 'Nuevo'}) : Cambiar nombre a las columnas.
df.rename(columns={'Edad': 'Años'}) # Cambiar el nombre de la columna 'Edad' a 'Años'.
# df.drop('Columna', axis=1) : Elimina una columna completa.
df.drop('Sueldo', axis=1) # Elimina la columna 'Sueldo'.

# 6. Agrupación y Agregación (groupby)
# Es lo más potente de Pandas para estadística descriptiva:
   # groupby('Ciudad') : Agrupa por la columna 'Ciudad'.
    #['Sueldo'].mean() : Calcula la media del sueldo para cada ciudad.

# # ¿Cuál es el sueldo promedio por Ciudad?
# df.groupby('Ciudad')['Sueldo'].mean()
df.groupby('Nombre')['Sueldo'].mean() # Sueldo promedio por Nombre.
# # Múltiples estadísticas a la vez
# df.groupby('Ciudad')['Edad'].agg(['mean', 'min', 'max'])


# 7. Ejemplo de un flujo de trabajo real
# Para tu clase, este sería un proceso estándar:
# Cargar: df = pd.read_csv('datos.csv')
# Limpiar: df = df.fillna(df.median())
# Explorar: print(df.describe())
# Agrupar: resumen = df.groupby('Categoria')['Ventas'].sum()
# Exportar: resumen.to_csv('resultado.csv')
# Pro Tip: En Pandas, la mayoría de las operaciones no modifican el DataFrame original, sino que devuelven uno nuevo. Si quieres que el cambio sea permanente, usa el parámetro inplace=True o sobreescribe la variable: df = df.dropna().