const fs = require('fs');
let code = fs.readFileSync('src/components/Practice.tsx', 'utf8');

// 1. Fix the question navigator scrolling
const navOld = `<div className="flex-1">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">`;
const navNew = `<div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-5 gap-2">`;
code = code.replace(navOld, navNew);

// 2. Fix the active session container to be h-full so it doesn't leak scroll to body
// Wait, we need to find exactly:
const activeRootOld = `<div className="w-full max-w-6xl mx-auto pb-8  flex flex-col relative">`;
const activeRootNew = `<div className="w-full h-full min-h-0 max-w-6xl mx-auto pb-8 flex flex-col relative">`;
code = code.replace(activeRootOld, activeRootNew);

// 3. Fix the "flex gap-6 flex-1 relative" to have min-h-0 so its children can scroll
const mainContentOld = `<div className="flex gap-6 flex-1 relative">`;
const mainContentNew = `<div className="flex gap-6 flex-1 relative min-h-0">`;
code = code.replace(mainContentOld, mainContentNew);

// 4. Fix the question area to be scrollable
const questionAreaOld = `<div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">`;
const questionAreaNew = `<div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 pb-4">
          <AnimatePresence mode="wait">`;
code = code.replace(questionAreaOld, questionAreaNew);

fs.writeFileSync('src/components/Practice.tsx', code);
console.log('Practice layout patched');
