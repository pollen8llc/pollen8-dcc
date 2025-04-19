
const defaultBanners = [
  {
    id: "tech",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    alt: "Technology Banner"
  },
  {
    id: "nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Nature Banner"
  },
  {
    id: "business",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    alt: "Business Banner"
  },
  {
    id: "education",
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    alt: "Education Banner"
  },
  {
    id: "creative",
    url: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80",
    alt: "Creative Banner"
  }
];

export const getRandomBanner = () => {
  const randomIndex = Math.floor(Math.random() * defaultBanners.length);
  return defaultBanners[randomIndex];
};

export default defaultBanners;
