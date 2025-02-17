const fetchPackages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/packages`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};
const deletePackage = async (id: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/packages/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.text();
    return data ? JSON.parse(data) : { success: true };
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};

const getPackage = async (id: string) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error(
        'Token no encontrado. Por favor inicia sesión nuevamente.'
      );
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/packages/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error al obtener el paquete:', error.message);
    return { error: error.message };
  }
};
const savePackage = async (
  id: number | null,
  payload: object,
  isEditMode: boolean
) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error(
        'Token no encontrado. Por favor inicia sesión nuevamente.'
      );
    }

    const url = isEditMode
      ? `${import.meta.env.VITE_API_URL}/packages/${id}`
      : `${import.meta.env.VITE_API_URL}/packages`;

    const response = await fetch(url, {
      method: isEditMode ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => null);
      return {
        error:
          errorDetails?.message ||
          `Error ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: isEditMode
        ? 'Paquete actualizado exitosamente.'
        : 'Paquete creado exitosamente.',
    };
  } catch (error: any) {
    console.error('Error en savePackage:', error.message);
    return { error: error.message };
  }
};

export { fetchPackages, deletePackage, getPackage, savePackage };
