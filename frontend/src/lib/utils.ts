/**
 * Format a number as currency (INR)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

/**
 * Truncate a string to a specific length
 */
export function truncateText(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
}

/**
 * Parse JWT token
 */
export function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
}
