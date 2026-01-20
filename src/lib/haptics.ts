export const hapticFeedback = {
    success: () => {
        if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    },
    error: () => {
        if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 50]);
    },
    light: () => {
        if (navigator.vibrate) navigator.vibrate(10);
    },
    medium: () => {
        if (navigator.vibrate) navigator.vibrate(20);
    }
};
