const fetchBanners = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/banners`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(error);
    return { error: error.message || 'Unknown error' };
  }
};

export { fetchBanners };
