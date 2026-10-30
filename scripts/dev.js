import { spawn } from 'child_process';

console.log('====================================================');
console.log('🚀 Starting StudentHub Full-Stack MERN Application');
console.log('   Backend: http://localhost:5000 (Express & MongoDB)');
console.log('   Frontend: http://localhost:5173 (Vite React)');
console.log('====================================================\n');

// 1. Launch Express & Mongoose Server
const server = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Launch Vite Client
const client = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
});

const cleanExit = () => {
  console.log('\nStopping StudentHub processes...');
  try {
    server.kill();
    client.kill();
  } catch {}
  process.exit(0);
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
