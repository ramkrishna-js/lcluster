import notifier from 'node-notifier';

export function sendDesktop(level, message) {
    // Only fire for danger and success per spec
    if (level !== 'danger' && level !== 'success') {
        return;
    }

    notifier.notify({
        title: 'lcluster',
        message: message,
        icon: '', // path to logo if available
        sound: false
    });
}
