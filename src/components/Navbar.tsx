
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-background py-4">
      <div className="container mx-auto px-4">
        <div className={`flex items-center ${isMobile ? "justify-center" : "justify-between"}`}>
          <a
            href="/"
            className="text-xl font-semibold flex items-center space-x-2"
          >
            <img 
              src="https://www.pollen8.app/wp-content/uploads/2025/03/DCCLOGO.png" 
              alt="DCC Logo" 
              width={75} 
              height={15} 
              className="text-foreground" 
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
