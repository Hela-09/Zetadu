const fs = require('fs');
let code = fs.readFileSync('src/components/Home.tsx', 'utf8');

const dailyChallengeJSX = `
          {/* Daily Challenge */}
          <div 
            onClick={() => setView('daily_challenge')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 md:p-8 text-white cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
              <Zap size={120} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={24} className="fill-current text-yellow-300" />
                  <h2 className="text-2xl font-bold">Daily Challenge</h2>
                </div>
                <p className="text-orange-100 mb-4 max-w-md">Complete 10 questions today to earn XP and increase your streak!</p>
                <button className="bg-white text-orange-600 px-6 py-2 rounded-xl font-bold shadow-sm group-hover:bg-orange-50 transition-colors">
                  Play Now
                </button>
              </div>
            </div>
          </div>
`;

code = code.replace(
  "{/* Personal Study Coach */}",
  dailyChallengeJSX + "\n          {/* Personal Study Coach */}"
);

// add Zap to imports if not there
if (!code.includes("Zap,")) {
    code = code.replace("import { ", "import { Zap, ");
}

fs.writeFileSync('src/components/Home.tsx', code);
