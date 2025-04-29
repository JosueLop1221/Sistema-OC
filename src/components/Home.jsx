import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../firebase";
import {
  FiChevronLeft, FiMenu, FiHome, FiClipboard,
  FiUsers, FiBarChart2, FiLogOut, FiUser
} from "react-icons/fi"; // Íconos
import OrdenesCompras from "./OrdenesCompras"; // Importar la pestaña de órdenes de compras

const auth = getAuth(appFirebase);

const Home = ({ correoUsuario }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Resumen OC"); // Estado para el ítem seleccionado

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const menuItems = [
    { name: "Resumen OC", icon: <FiHome size={20} /> },
    { name: "Órdenes de Compras", icon: <FiClipboard size={20} /> },
    { name: "Usuarios", icon: <FiUsers size={20} /> },
    { name: "Reportes", icon: <FiBarChart2 size={20} /> },
  ];

  return (
    <div className="flex h-screen ">
      {/* Panel lateral */}
      <div
        className={`bg-[#121D4D] text-white p-4 fixed left-0 top-0 h-full shadow-lg flex flex-col transition-all duration-500 ease-in-out ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Botón para ocultar/mostrar el panel */}
        <div className="flex justify-between items-center mb-4">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-center w-full transition-opacity duration-500 ease-in-out opacity-100 whitespace-nowrap">
              Castillo IT
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-blue-600 transition"
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Nombre de usuario con ícono */}
        <div className="flex items-center gap-2 mb-4">
          <FiUser size={20} className="text-white" />
          <p
            className={`text-sm transition-opacity duration-500 ease-in-out ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            } whitespace-nowrap`}
          >
            {correoUsuario}
          </p>
        </div>

        {/* Menú de opciones */}
        <ul className="space-y-2 flex-1">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-500 ease-in-out hover:bg-blue-600 hover:scale-105 ${
                selectedMenu === item.name ? "bg-blue-600 text-white" : "text-gray-300"
              }`}
              onClick={() => setSelectedMenu(item.name)} // Cambia el estado de la opción seleccionada
            >
              {/* Icono siempre visible */}
              {item.icon}
              {sidebarOpen && (
                <span className="transition-opacity duration-500 ease-in-out whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-500 ease-in-out hover:bg-red-600 hover:scale-105"
        >
          <FiLogOut size={20} />
          {sidebarOpen && <span className="whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 ml-16 md:ml-60 overflow-auto p-6">
        {selectedMenu === "Resumen OC" && (
          <div>
            <h1 className="text-3xl font-bold">Bienvenido al sistema</h1>
            <p className="text-gray-600 mt-2">Selecciona una opción del menú.</p>
          </div>
        )}
        {selectedMenu === "Órdenes de Compras" && <OrdenesCompras />}
        {/* Agrega más componentes según el menú */}
      </div>
    </div>
  );
};

export default Home;
