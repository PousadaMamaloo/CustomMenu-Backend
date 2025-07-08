/**
 * @description Gerencia uma blacklist de tokens JWT em memória para invalidar sessões (ex: logout).
 * Inclui um mecanismo de limpeza automática para remover tokens que já expiraram.
 */

class TokenBlacklist {
    constructor() {
        this.blacklistedTokens = new Set();
        this.tokenExpirations = new Map();
        
        setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);
    }

    addToken(token, exp) {
        this.blacklistedTokens.add(token);
        this.tokenExpirations.set(token, exp * 1000);
    }

    isTokenBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }

    cleanupExpiredTokens() {
        const now = Date.now();
        
        for (const [token, expiration] of this.tokenExpirations.entries()) {
            if (expiration <= now) {
                this.blacklistedTokens.delete(token);
                this.tokenExpirations.delete(token);
            }
        }
        
        console.log(`Blacklist cleanup: ${this.blacklistedTokens.size} tokens ativos na blacklist`);
    }

    getBlacklistSize() {
        return this.blacklistedTokens.size;
    }

    clearBlacklist() {
        this.blacklistedTokens.clear();
        this.tokenExpirations.clear();
    }
}

const tokenBlacklist = new TokenBlacklist();

export default tokenBlacklist;

