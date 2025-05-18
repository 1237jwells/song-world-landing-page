import React from 'react';
import merchIcon from '../assets/song-world/transparent/AI-GEN/merch_icon_square.png';
// Define the type for a single merchandise item
interface MerchItem {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string; // Ensure you replace these with actual paths or imports
  purchaseUrl: string; // Ensure you replace these with actual purchase links
}

// Define the props for the component
interface MerchDisplayProps {
  title?: string;
}

// Placeholder data (replace with actual data or fetch from an API)
const merchItems: MerchItem[] = [
  {
    id: 1,
    name: "Song World Logo Tee",
    description: "Classic comfort and style, featuring the official Song World logo.",
    price: "$25.00",
    imageUrl: "/images/merch/tshirt-mockup.jpg", 
    purchaseUrl: "YOUR_PRINTFUL_OR_PRINTIFY_PRODUCT_LINK_1"
  },
  {
    id: 2,
    name: "Song World Mug",
    description: "Start your day with inspiration and your favorite beverage.",
    price: "$15.00",
    imageUrl: "/images/merch/mug-mockup.jpg",
    purchaseUrl: "YOUR_PRINTFUL_OR_PRINTIFY_PRODUCT_LINK_2"
  },
  {
    id: 3,
    name: "Song World Cap",
    description: "Top off your look with this stylish Song World cap.",
    price: "$20.00",
    imageUrl: "/images/merch/cap-mockup.jpg",
    purchaseUrl: "YOUR_PRINTFUL_OR_PRINTIFY_PRODUCT_LINK_3"
  },
  {
    id: 4,
    name: "Song World Stickers (3-pack)",
    description: "Decorate your gear with these high-quality Song World stickers.",
    price: "$10.00",
    imageUrl: "/images/merch/stickers-mockup.jpg",
    purchaseUrl: "YOUR_PRINTFUL_OR_PRINTIFY_PRODUCT_LINK_4"
  },
];

const MerchDisplay: React.FC<MerchDisplayProps> = ({ title = "Official Merch" }) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <img 
          src={merchIcon.src} 
          alt="Merch Icon" 
          className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
        />
      </div>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-songworld-light-primary dark:text-songworld-dark-primary mb-16">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {merchItems.map(item => (
          <div key={item.id} className="bg-songworld-light-card dark:bg-songworld-dark-card rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
            <div className="aspect-w-1 aspect-h-1 w-full">
              {/* In React, img needs closing slash if not using children */}
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-songworld-light-text dark:text-songworld-dark-text mb-2">{item.name}</h3>
              <p className="text-songworld-light-text/80 dark:text-songworld-dark-text/80 text-sm mb-4 flex-grow">{item.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-songworld-light-primary/10 dark:border-songworld-dark-primary/10">
                <p className="text-lg font-bold text-songworld-light-primary dark:text-songworld-dark-primary">{item.price}</p>
                <a 
                  href={item.purchaseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-songworld-light-accent hover:bg-songworld-light-accent/90 dark:bg-songworld-dark-accent dark:hover:bg-songworld-dark-accent/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center mt-16 text-songworld-light-text/70 dark:text-songworld-dark-text/70">
        All merchandise is fulfilled by our trusted Print-on-Demand partners. Clicking "Buy Now" will take you to their secure checkout.
      </p>
    </div>
  );
};

export default MerchDisplay; 