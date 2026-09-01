const fs = require('fs');

function removeScroll(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Remove h-full from root containers
  code = code.replace(/className="w-full max-w-7xl mx-auto pb-12 flex flex-col h-full"/g, 'className="w-full max-w-7xl mx-auto pb-12 flex flex-col"');
  code = code.replace(/className="w-full max-w-5xl mx-auto pb-8 h-full flex flex-col"/g, 'className="w-full max-w-5xl mx-auto pb-8 flex flex-col"');
  code = code.replace(/className="w-full max-w-5xl mx-auto pb-8 flex flex-col h-full"/g, 'className="w-full max-w-5xl mx-auto pb-8 flex flex-col"');
  code = code.replace(/className="w-full max-w-7xl mx-auto pb-8 h-full flex flex-col"/g, 'className="w-full max-w-7xl mx-auto pb-8 flex flex-col"');
  code = code.replace(/className="w-full max-w-2xl mx-auto pb-8 flex flex-col items-center justify-center min-h-\[50vh\] h-full"/g, 'className="w-full max-w-2xl mx-auto pb-8 flex flex-col items-center justify-center min-h-[50vh]"');

  // For Practice grid
  code = code.replace(/gap-6 flex-1 overflow-y-auto pb-8 pr-2/g, 'gap-6 flex-1 pb-8');
  // For Practice question area
  code = code.replace(/className="flex flex-col justify-center min-w-0 h-full overflow-hidden"/g, 'className="flex flex-col justify-center min-w-0 flex-1 overflow-hidden"');
  // For Practice question text wrapper
  code = code.replace(/className="flex-1 overflow-y-auto"/g, 'className="flex-1"');
  code = code.replace(/className="flex-1 overflow-y-auto pb-8 pr-2"/g, 'className="flex-1 pb-8"');

  fs.writeFileSync(file, code);
}

removeScroll('src/components/Subjects.tsx');
removeScroll('src/components/Practice.tsx');
removeScroll('src/components/Home.tsx');
removeScroll('src/components/Profile.tsx');
console.log("Fixed scrolling and heights");
