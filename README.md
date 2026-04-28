# SportyStyle - Actividad Semana 6

Mini tienda virtual desarrollada para la asignatura Taller de Plataformas Web.

## Funcionalidades implementadas

- Selección de productos
- Carrito de compras
- Session Storage
- Autenticación con Auth0
- Simulación de pago y despacho
- Cierre de sesión
- HTTPS con certificado SSL local

## Flujo de autenticación

Se utilizó Auth0 para permitir el inicio de sesión seguro de los usuarios. El sistema redirige al usuario al login de Auth0, donde puede autenticarse mediante Google o correo electrónico. Una vez autenticado, vuelve automáticamente a la tienda mostrando un mensaje de bienvenida y habilitando la sesión activa.

## Selección de productos

La tienda permite seleccionar productos mediante el botón "Agregar al carrito". Cada producto contiene imagen, nombre, descripción y precio. Los productos seleccionados se almacenan temporalmente durante la navegación.

## Uso de Session Storage

Session Storage permite guardar el carrito de compras mientras la sesión está activa. Al cerrar sesión o finalizar la compra, los datos se eliminan automáticamente para proteger la información temporal del usuario.

## Seguridad HTTPS

Se implementó un servidor local HTTPS utilizando OpenSSL para generar certificados SSL autofirmados. Esto permite simular una conexión segura y reforzar la protección de los datos transmitidos.
