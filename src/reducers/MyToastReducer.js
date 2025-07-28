export default (current, action) => {
    switch (action.type) {
        case 'set':
            return action.payload;
        case "clear":
            return null;
    }
    return current;
}