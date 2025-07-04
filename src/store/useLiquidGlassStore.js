import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLiquidGlassStore = create(
  persist(
    (set, get) => ({
      isLiquidGlassActive: false,
      liquidGlassWidth: 300,
      liquidGlassHeight: 200,
      
      toggleLiquidGlass: () => {
        set((state) => ({ 
          isLiquidGlassActive: !state.isLiquidGlassActive 
        }));
      },
      
      setLiquidGlassActive: (active) => {
        set({ isLiquidGlassActive: active });
      },
      
      setLiquidGlassSize: (width, height) => {
        set({ 
          liquidGlassWidth: width, 
          liquidGlassHeight: height 
        });
      },
    }),
    {
      name: 'liquid-glass-storage',
      partialize: (state) => ({
        isLiquidGlassActive: state.isLiquidGlassActive,
        liquidGlassWidth: state.liquidGlassWidth,
        liquidGlassHeight: state.liquidGlassHeight,
      }),
    }
  )
);

export default useLiquidGlassStore; 