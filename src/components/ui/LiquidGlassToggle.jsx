import React from 'react';
import { Droplets } from 'lucide-react';
import useLiquidGlassStore from '../../store/useLiquidGlassStore';

const LiquidGlassToggle = ({ className = "" }) => {
  const { isLiquidGlassActive, toggleLiquidGlass } = useLiquidGlassStore();

  return (
    <button
      onClick={toggleLiquidGlass}
      className={`p-2 rounded-full transition-colors duration-300 hover:bg-slate-400 dark:hover:bg-slate-400 focus:outline-none ${className}`}
      title={isLiquidGlassActive ? "Disable Liquid Glass Effect" : "Enable Liquid Glass Effect"}
    >
      <Droplets 
        size={20} 
        className={`transition-all duration-300 ${
          isLiquidGlassActive 
            ? 'text-blue-500 drop-shadow-lg' 
            : 'text-gray-600 dark:text-gray-300'
        }`}
      />
    </button>
  );
};

export default LiquidGlassToggle; 