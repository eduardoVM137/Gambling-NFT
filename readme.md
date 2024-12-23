# Gambling-NFT

## Descripción General
**Gambling-NFT** es una plataforma basada en blockchain que permite a los usuarios comprar paquetes de cartas que se convierten en NFTs (Tokens No Fungibles). Estos NFTs pueden ser coleccionados, vendidos o utilizados para participar en eventos de apuestas. El proyecto combina la tecnología blockchain con Solidity para contratos inteligentes y un frontend moderno con React.

## Funcionalidades Principales
- **Compra de Packs de Cartas**: Los usuarios pueden comprar paquetes que contienen cartas aleatorias.
- **Conversión a NFTs**: Las cartas se convierten en NFTs únicos almacenados en la blockchain.
- **Venta y Comercio de NFTs**: Los usuarios pueden listar y vender sus cartas en el mercado integrado.
- **Wallet y Donaciones**: Cada usuario tiene una wallet que permite realizar donaciones al proyecto.

## Tecnologías Utilizadas
- **Backend**:
  - Solidity: Contratos inteligentes en la blockchain de Ethereum.
  - Hardhat: Framework para desarrollar, probar y desplegar contratos inteligentes.
- **Frontend**:
  - React: Para la creación de la interfaz de usuario.
  - Web3.js: Para la interacción con los contratos inteligentes.
- **Blockchain**:
  - Ethereum (Red de Pruebas Sepolia): Implementación y despliegue de contratos.
- **Otras Herramientas**:
  - OpenZeppelin: Biblioteca para contratos inteligentes.
  - Node.js: API backend para manejar interacciones complejas.

## Contratos Inteligentes
### 1. **Contrato de Packs**
- Función: Permite a los usuarios comprar un pack y recibir NFTs aleatorios.
- Lógica: 1 de cada 3 intentos genera un NFT exitoso.

### 2. **Contrato de NFTs**
- Función: Maneja la creación y transferencia de NFTs.
- Características: Cada NFT está asociado a una imagen y metadatos únicos.

### 3. **Contrato de Subastas**
- Función: Gestiona subastas de NFTs entre usuarios.
- Características: Soporte para pujas y visualización de subastas activas.

### 4. **Contrato de Donaciones**
- Función: Recibe donaciones de los usuarios.
- Características: Registro de eventos de donación y saldo disponible.

## Instalación y Configuración
### Requisitos Previos
- Node.js y npm instalados.
- Metamask configurado con la red de pruebas Sepolia.
- Clonar el repositorio:
  ```bash
  git clone https://github.com/eduardoVM137/Gambling-NFT.git
  cd Gambling-NFT
