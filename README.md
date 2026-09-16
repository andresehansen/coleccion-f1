# 🏎️ GUÍA DE USO Y ADMINISTRACIÓN: CATÁLOGO F1 (ANDY HANSEN)

Esta guía documenta paso a paso cómo gestionar, editar y ampliar tu colección de réplicas de Fórmula 1 a escala, tanto en tu computadora (modo local) como en tu sitio web público en internet.

---

## 🌐 Enlaces del Proyecto

* **Catálogo en línea (Público en Internet):**  
  👉 [https://andresehansen.github.io/coleccion-f1/](https://andresehansen.github.io/coleccion-f1/)  
  *(Accesible desde cualquier celular, tablet o computadora sin necesidad de prender tu PC).*

* **Catálogo en tu PC (Modo Local):**  
  👉 `http://localhost:5173/coleccion-f1/`  
  *(Se abre automáticamente al ejecutar `abrir_web.bat`).*

---

## ⚡ Los 3 Archivos de Control (.bat)

En la carpeta principal del proyecto (`C:\Proyectos\F1`) tienes tres archivos ejecutables con doble clic:

| Archivo | ¿Para qué sirve? |
| :--- | :--- |
| **`abrir_web.bat`** | Inicia el servidor en tu computadora y abre el catálogo en tu navegador web. |
| **`sincronizar_local.bat`** | Lee los cambios que hayas hecho en Excel o fotos y los aplica en tu PC (luego solo presionas `F5` en la página). |
| **`actualizar.bat`** | Sincroniza los cambios, compila el sitio y **lo publica en internet (GitHub Pages)** en 1 o 2 minutos. |

---

## ✏️ 1. Cómo MODIFICAR o EDITAR un auto existente

Si quieres corregir una errata, cambiar un año, retocar el texto de la historia o actualizar las estadísticas de un monoplaza:

### Paso 1: Editar en Excel
1. Abre el archivo **`Coleccion_F1.xlsx`** con Microsoft Excel.
2. Busca la fila del auto que deseas modificar.
3. Edita cualquier campo:
   * **`Modelo` / `Anio` / `Piloto` / `Escuderia`:** Datos principales visibles en la tarjeta y título.
   * **`Historia_Auto`:** Texto que explica la trayectoria del monoplaza.
   * **`Historia_Piloto`:** Texto sobre el desempeño del piloto en esa temporada.
   * **`Motor`, `Chasis`, `Caja`, `Diseñador`:** Especificaciones técnicas de ingeniería.
   * **`Eq_Victorias`, `Pil_Victorias`, `Pil_Pos`, etc.:** Estadísticas de carrera y campeonato.
4. **Guarda y cierra el archivo Excel.**

### Paso 2: Cambiar o reemplazar fotos (Opcional)
Las fotos de cada auto están guardadas en carpetas ordenadas por número:  
📁 `web\public\cars\car_1\`, `car_2\`, ..., `car_51\` (según el número de fila del Excel).

Dentro de cada carpeta encontrarás:
* **`model.png`** (o `model.jpg`): La foto de tu réplica a escala física.
* **`real.jpg`**: La foto del monoplaza real en pista.
* **`driver.jpg`**: El retrato del piloto.

Si deseas cambiar alguna foto, simplemente pega tu nueva imagen en esa carpeta con el mismo nombre y extensión.

### Paso 3: Aplicar los cambios
* **Para verlos en tu PC:** Haz doble clic en **`sincronizar_local.bat`** y recarga tu navegador con `F5`.
* **Para publicarlos en internet:** Haz doble clic en **`actualizar.bat`**.

---

## ➕ 2. Cómo AGREGAR un NUEVO AUTO a la colección

Tienes dos opciones muy sencillas:

---

### Opción A: Usando la Inteligencia Artificial (Recomendada y rápida)

1. Abre el programa haciendo doble clic en **`abrir_web.bat`**.
2. En el menú lateral izquierdo, haz clic en **"✨ Agente IA"**.
3. Ingresa el **Modelo** (ejemplo: `Ferrari F2004`) y el **Piloto** (ejemplo: `Michael Schumacher`).
4. Haz clic en el botón **"Generar"**.
   * La IA investigará automáticamente los datos del motor, diseñador, transmisión, chasis, redactará las historias del auto y piloto, y calculará las victorias, poles y podios de esa temporada.
5. Revisa los datos en pantalla y presiona **"Guardar en Colección"**.
6. El auto se guardará automáticamente en el Excel y se sumará al catálogo.
7. Para agregarle sus fotos:
   * Ve a `web\public\cars\` y entra en la nueva carpeta que se habrá creado para ese auto (por ejemplo `car_52`).
   * Coloca allí sus 3 archivos: `model.jpg`, `real.jpg` y `driver.jpg`.
8. Haz doble clic en **`actualizar.bat`** para publicar la actualización en internet.

---

### Opción B: Manualmente desde Excel

1. Abre **`Coleccion_F1.xlsx`** en Excel.
2. Ve al final de la tabla y agrega una nueva fila (por ejemplo, la fila 52) completando las columnas con la información que desees.
3. Guarda y cierra el Excel.
4. Ve a la carpeta `web\public\cars\` y crea una nueva carpeta llamada `car_52` (con el número correspondiente).
5. Dentro de esa carpeta pega las 3 fotos:
   * `model.jpg`
   * `real.jpg`
   * `driver.jpg`
   *(Si aún no tienes las tres fotos no te preocupes: el sistema mostrará un ícono elegante en lugar de romperse).*
6. Haz doble clic en **`sincronizar_local.bat`** (para probar en tu PC) o en **`actualizar.bat`** (para subirlo a internet).

---

## 📁 3. Estructura de Archivos Importantes

```text
C:\Proyectos\F1\
│
├── Coleccion_F1.xlsx          <- Tu base de datos maestra con todos los autos
├── abrir_web.bat              <- Ejecutable para abrir el catálogo localmente
├── sincronizar_local.bat      <- Sincroniza cambios de Excel/fotos a nivel local
├── actualizar.bat             <- Publica la web actualizada en GitHub Pages
├── extract_assets.py          <- Script interno que procesa las fotos y genera los datos
│
└── web\
    └── public\
        ├── collection.json    <- Archivo de datos optimizado para la web
        └── cars\
            ├── car_1\         <- Fotos del auto 1 (model, real, driver)
            ├── car_2\         <- Fotos del auto 2
            └── ...            <- etc.
```

---

## 💡 4. Preguntas Frecuentes y Consejos

* **¿Hice un cambio en internet con `actualizar.bat` pero no lo veo en mi celular?**  
  Los navegadores a veces guardan en caché las páginas viejas. En tu PC presiona **`Ctrl + F5`**. En tu celular, ve a la configuración del navegador y borra los datos de navegación recientes, o abre el enlace en una pestaña de incógnito.

* **¿Cómo cerrar la ventana emergente de un auto rápidamente?**  
  Puedes hacer clic en la `X` de la esquina superior derecha, hacer clic en cualquier parte oscura fuera de la ventana, o simplemente presionar la tecla **`Escape` (Esc)** en tu teclado.

* **¿Se pueden ampliar las fotos en la ficha del auto?**  
  Sí, al hacer clic en cualquiera de las 3 fotos de la ficha (la maqueta, el auto real o el piloto), se abrirá una vista ampliada en alta resolución con fondo oscuro.
