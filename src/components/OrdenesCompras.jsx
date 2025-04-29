import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import appFirebase from "../firebase";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const db = getFirestore(appFirebase);

const OrdenesCompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredOrdenes, setFilteredOrdenes] = useState([]); 
  const [showFormulario, setShowFormulario] = useState(false); 
  const [usdToLempiras, setUsdToLempiras] = useState(0); // Estado para almacenar el valor del dólar en lempiras
  
  // Obtener la tasa de cambio del dólar al lempira
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/cc73cf2d65eac77e2de348e7/latest/USD');
        setUsdToLempiras(response.data.conversion_rates.HNL);
      } catch (error) {
        console.error("Error al obtener la tasa de cambio:", error);
      }
    };
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60000); // Actualiza cada minuto
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);
  
  useEffect(() => {
    const obtenerOrdenes = async () => {
      try {
        const ordenesRef = collection(db, "Ordenes");
        const snapshot = await getDocs(ordenesRef);
        const datos = await Promise.all(snapshot.docs.map(async (doc) => {
          const ordenData = { id: doc.id, ...doc.data() };
          
          // Obtener la subcolección "Compras" de cada orden
          const comprasRef = collection(doc.ref, "Compras");
          const comprasSnapshot = await getDocs(comprasRef);
          const compras = comprasSnapshot.docs.map((compraDoc) => compraDoc.data());
    
          const subtotal = compras.reduce((total, compra) => total + (compra.Precio_Venta || 0), 0);
          const isv = subtotal * 0.15;
          const inversion = compras.reduce((total, compra) => total + (compra.Precio_Compra || 0), 0) + ordenData.Envio;
          const total = subtotal + isv;
  
          return { ...ordenData, compras, subtotal, isv, inversion, total };
        }));
    
        setOrdenes(datos);
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      }
    };
  
    obtenerOrdenes();
  }, []);
  
  
  

  // Filtrar órdenes según el valor de búsqueda
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredOrdenes([]);
    } else {
      const ordenesFiltradas = ordenes.filter((orden) => {
        const searchString = `${orden.Num_Ordn} - ${orden.Cliente}`.toLowerCase();
        return searchString.includes(searchQuery.toLowerCase());
      });
      setFilteredOrdenes(ordenesFiltradas);
    }
  }, [searchQuery, ordenes]);

  // Función para manejar la selección de una orden
  const handleSelectOrden = (orden) => {
    const searchValue = `${orden.Num_Ordn} - ${orden.Cliente}`;
    setSearchQuery(searchValue); // Establece el valor exacto en la búsqueda
    setFilteredOrdenes([]); // Limpiar las sugerencias
  };

  // Función para abrir o cerrar el formulario
  const toggleFormulario = () => {
    setShowFormulario(!showFormulario);
  };

  // Filtrar las órdenes según el cliente o número de orden seleccionado
  const filteredResults = searchQuery === "" ? ordenes.slice(0, 1) : ordenes.filter((orden) => {
    const searchString = `${orden.Num_Ordn} - ${orden.Cliente}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <div className="relative">
        <button
          className="absolute top-4 right-4 bg-black text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none transition-all duration-300"
          onClick={toggleFormulario}
        >
          + Nueva Orden
        </button>
      </div>
      
      {showFormulario && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/60">
          <div className="p-6 bg-white shadow-lg rounded-md w-[600px] max-w-full relative">
            <h2 className="text-xl font-semibold text-left text-gray-800">Nueva Orden</h2>
            <p className="text-sm text-gray-500 text-left mb-4">Complete los detalles de la nueva orden de compra</p>
            
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="Cliente" className="block text-xs font-medium text-gray-700 text-left">
                    Cliente:
                  </label>
                  <input 
                    type="text"
                    id="Cliente"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Usuario" className="block text-xs font-medium text-gray-700 text-left">
                    Usuario:
                  </label>
                  <input 
                    type="text"
                    id="Usuario"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Destino" className="block text-xs font-medium text-gray-700 text-left">
                    Destino:
                  </label>
                  <input 
                    type="text"
                    id="Destino"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Fecha_Recibido" className="block text-xs font-medium text-gray-700 text-left">
                    Fecha de recepción:
                  </label>
                  <input 
                    type="date"
                    id="Fecha_Recibido"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Fecha_Entrega" className="block text-xs font-medium text-gray-700 text-left">
                    Fecha de entrega:
                  </label>
                  <input 
                    type="date"
                    id="Fecha_Entrega"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Imagen_Orden" className="block text-xs font-medium text-gray-700 text-left">
                    Imagen de orden:
                  </label>
                  <input 
                    type="file"
                    id="Imagen_Orden"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={toggleFormulario}
                  className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-all duration-300 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-all duration-300 text-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Barra de búsqueda */}
      <div className="mb-4 relative flex items-center max-w-md w-full ml-[-15px] mt-[-22px]">
        {/* Ícono de lupa */}
        <i className="fas fa-search absolute left-3 text-gray-500"></i>
        <input
        type="text"
        placeholder="Buscar por número de orden o cliente..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-300 w-full"
        />
        
        {/* Lista de sugerencias */}
        {filteredOrdenes.length > 0 && (
            <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400 top-full left-0">
                {filteredOrdenes.map((orden) => (
                    <li
                    key={orden.id}
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    onClick={() => handleSelectOrden(orden)}
                    >
                        <div className="text-sm font-medium text-gray-700">
                            {/* Mostrar el número de orden y el cliente */}
                            {orden.Num_Ordn} - {orden.Cliente}
                        </div>
                   </li>))}
            </ul>
        )}
      </div>


      <div className="w-auto flex flex-wrap gap-4">
        {filteredResults.length === 0 ? (
          <p className="text-center text-gray-500 w-full">No se encontraron órdenes.</p>
        ) : (
          filteredResults.map((orden) => (
            <div key={orden.id} className="flex space-x-4">
              {/* Tarjeta para el Cliente */}
              <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200 ml-[-15px]">
                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
                  <i className="fas fa-user text-xl"></i>
                </div>
                <h4 className="font-semibold text-xs text-gray-600">Cliente:</h4>
                <p className="font-bold text-lg text-gray-800">{orden.Cliente}</p>
                <p className="text-xs text-gray-600">Usuario: {orden.Firebase_UID}</p>
              </div>

              {/* Tarjeta para el Destino */}
              <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
                  <i className="fas fa-map-marker-alt text-xl"></i>
                </div>
                <h4 className="font-semibold text-xs text-gray-600">Destino:</h4>
                <p className="font-bold text-lg text-gray-800">{orden.Destino}</p>
                <p className="text-xs text-gray-600">Días de Entrega: {orden.Dias_Entrega}</p>
              </div>

              {/* Tarjeta para la Fecha */}
              <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
                <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
                  <i className="fas fa-calendar text-xl"></i>
                </div>
                <h4 className="font-semibold text-xs text-gray-600">Fecha:</h4>
                <p className="font-bold text-lg text-gray-800">
                  {orden.Fecha_Entrega ? orden.Fecha_Entrega.toDate().toLocaleDateString("es-ES") : "No disponible"}
                </p>
                <p className="text-xs text-gray-600">
                  Recibido: {orden.Fecha_Recibido ? orden.Fecha_Recibido.toDate().toLocaleDateString("es-ES") : "No disponible"}
                </p>
              </div>

              {/* Tarjeta para el Total */}
      <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
        <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
          <i className="fas fa-dollar-sign text-xl"></i>
        </div>
        <h4 className="font-semibold text-xs text-gray-600">Total:</h4>
        <p className="font-bold text-lg text-gray-800">L.{filteredResults.length > 0 ? filteredResults[0].total.toFixed(2) : '0.00'}</p>
        <p className="text-xs text-gray-600">Dólar: L.{(usdToLempiras * 1).toFixed(2)}</p>
      </div>

            </div>
          ))
        )}
        {/* Tarjeta que abarca todo el ancho */}
<div className="w-[1000px] p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left border border-gray-200 mt-6 ml-[-15px] relative">
    {/* Título dinámico con ícono de compra */}
    <h4 className="font-semibold text-lg text-black absolute top-6 left-6 flex items-center">
        {/* Ícono de carrito de compras */}
        <i className="fas fa-shopping-cart mr-2 text-gray-400"></i>
        {filteredResults.length > 0 ? `Compras de la Orden ${filteredResults[0].Num_Ordn}` : 'Compras de la Orden'}
    </h4>
    
    {/* Títulos de los campos en fila con línea debajo */}
    <div className="mt-14 flex justify-between text-sm text-gray-600 border-b border-gray-300 pb-2">
        <div className="w-[12%] text-center">Descripción</div>
        <div className="w-[12%] text-center">Cantidad</div>
        <div className="w-[12%] text-center">Precio Venta</div>
        <div className="w-[12%] text-center">Precio Compra</div>
        <div className="w-[12%] text-center">Tienda</div>
        <div className="w-[12%] text-center">Tracking</div>
        <div className="w-[12%] text-center">Estatus</div>
        <div className="w-[12%] text-center">Acciones</div>
    </div>

    {/* Mostrar las compras de la subcolección */}
    <div className="mt-4">
        {filteredResults.length > 0 && filteredResults[0].compras.map((compra, index) => (
            <div key={index} className="flex justify-between text-sm pt-3">
                <div className="w-[12%] text-center">{compra.Descripción}</div>
                <div className="w-[12%] text-center">{compra.Cantidad}</div>
                <div className="w-[12%] text-center">{compra.Precio_Venta}</div>
                <div className="w-[12%] text-center">{compra.Precio_Compra}</div>
                <div className="w-[12%] text-center">{compra.Tienda}</div>
                <div className="w-[12%] text-center">{compra.Tracking}</div>
                <div className="w-[12%] text-center">{compra.Estatus}</div>
                <div className="w-[12%] text-center">Acciones</div>
            </div>
        ))}
    </div>
</div>



        {/* Cuatro tarjetas específicas debajo de la tarjeta grande */}
<div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 ml-[-15px]">
  {/* Tarjeta de Envío */}
  <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 min-h-[110px] border border-gray-200 ">
    <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
      <i className="fas fa-truck text-xl"></i>
    </div>
    <h4 className="font-semibold text-xs text-gray-600">Envío:</h4>
    <p className="font-bold text-lg text-gray-800">
      {filteredResults.length > 0 ? `L. ${filteredResults[0].Envio}` : 'L. 0.00'}
    </p>
  </div>

  {/* Tarjeta de Subtotal */}
  <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
    <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
      <i className="fas fa-money-bill-wave text-xl"></i>
    </div>
    <h4 className="font-semibold text-xs text-gray-600">Subtotal:</h4>
    <p className="font-bold text-lg text-gray-800">
      L. {filteredResults.length > 0 ? filteredResults[0].subtotal.toFixed(2) : '0.00'}
    </p>
  </div>

  {/* Tarjeta de ISV */}
  <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
    <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
      <i className="fas fa-percent text-xl"></i>
    </div>
    <h4 className="font-semibold text-xs text-gray-600">ISV:</h4>
    <p className="font-bold text-lg text-gray-800">
      L. {filteredResults.length > 0 ? filteredResults[0].isv.toFixed(2) : '0.00'}
    </p>
  </div>

  {/* Tarjeta de Inversión */}
  <div className="p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-left relative w-56 border border-gray-200">
    <div className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 cursor-pointer">
      <i className="fas fa-hand-holding-usd text-xl"></i>
    </div>
    <h4 className="font-semibold text-xs text-gray-600">Inversión:</h4>
    <p className="font-bold text-lg text-gray-800">
      L. {filteredResults.length > 0 ? filteredResults[0].inversion.toFixed(2) : '0.00'}
    </p>
  </div>
</div>

        </div>
    </div>
  );
};

export default OrdenesCompras;
