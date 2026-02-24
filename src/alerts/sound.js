export function sendSound(level) {
    if (level === 'danger') {
        process.stdout.write('\x07');
    }
}
