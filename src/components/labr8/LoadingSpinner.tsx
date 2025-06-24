
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
