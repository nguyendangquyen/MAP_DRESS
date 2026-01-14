const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log('Running prisma generate...');
    const genOutput = execSync('npx prisma generate', { encoding: 'utf8' });
    fs.writeFileSync('prisma-gen-log.txt', genOutput);
    console.log('Prisma generate output saved to prisma-gen-log.txt');

    console.log('Running prisma db push --force-reset (Dry run check or actual push if needed)...');
    // Using --accept-data-loss for automation safety in this context if we are sure, 
    // but better to just check status first.
    const pushOutput = execSync('npx prisma db push --skip-generate', { encoding: 'utf8' });
    fs.writeFileSync('prisma-push-log.txt', pushOutput);
    console.log('Prisma db push output saved to prisma-push-log.txt');
} catch (error) {
    fs.writeFileSync('prisma-error-log.txt', error.stdout + '\n' + error.stderr + '\n' + error.message);
    console.error('Error during prisma commands:', error.message);
}
