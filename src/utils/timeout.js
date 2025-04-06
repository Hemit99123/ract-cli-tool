export const handleTimeOut = () => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Input timed out!'));
        }, 8000);
    });
}