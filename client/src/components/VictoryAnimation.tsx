import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

interface VictoryAnimationProps {
  show: boolean;
}

export default function VictoryAnimation({ show }: VictoryAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: 1,
            y: [0, -20, 0]
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, times: [0, 0.7, 1] }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-primary/90 text-primary-foreground p-8 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 1,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Trophy className="w-16 h-16" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-center"
            >
              Congratulations!
              <br />
              You Won!
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
