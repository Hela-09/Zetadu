const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('motion/react')) {
  code = code.replace(
    "import { LogOut } from 'lucide-react';",
    "import { LogOut } from 'lucide-react';\nimport { AnimatePresence, motion } from 'motion/react';"
  );
}

// Wrap Suspense children
const suspenseStart = `<Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label="Loading section..."></div>
              </div>
            }>`;

const suspenseEnd = `            </Suspense>`;

const viewLogic = `              {currentView === 'home' && <Home setView={setCurrentView} />}
              {currentView === 'subjects' && <Subjects setView={setCurrentView} />}
              {currentView === 'practice' && <Practice />}
              {currentView === 'tutor' && <Tutor setCurrentView={setCurrentView} />}
              {currentView === 'profile' && <Profile setView={setCurrentView} />}
              {currentView === 'admin' && <Admin />}`;

const animatedLogic = `              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 flex flex-col min-h-0 relative"
                >
${viewLogic}
                </motion.div>
              </AnimatePresence>`;

code = code.replace(viewLogic, animatedLogic);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for animations');
