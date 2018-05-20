export default {
    sessionUnreadCount (state) {
        let result = '';
        result = state.sessionUnreadCount <= 99 ? state.sessionUnreadCount : '99+'
        return result?result+'':'';
    }
}