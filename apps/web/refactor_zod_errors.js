const fs = require('fs');
const { globSync } = require('glob');

const files = globSync('apps/web/app/api/**/*.ts');

let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // We want to replace this exact pattern:
  // if (!validated.success) { throw new ApiError('Invalid input...', 400); }
  // with:
  // if (!validated.success) { throw validated.error; }

  const zodErrorPattern1 = /if\s*\(!validated\.success\)\s*\{\s*throw new ApiError\([^)]+\);\s*\}/g;
  
  if (zodErrorPattern1.test(content)) {
    content = content.replace(zodErrorPattern1, "if (!validated.success) { throw validated.error; }");
    changed = true;
  }

  // Also catch variations where they just did `throw new ApiError('Invalid input', 400);`
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated Zod error handling in ${file}`);
    count++;
  }
});

console.log('Fixed', count, 'files for Zod errors.');
