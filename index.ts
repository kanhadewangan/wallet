export class Cookies {
    private cookie: Record<string, string>;
    /**
     * A simple class to manage cookies.
     * @param cookie An object representing the initial cookies.
     */
    constructor(cookie: Record<string, string> = {}) {
        this.cookie = cookie;
        
    }
    get(key: string): string | undefined {
        return this.cookie[key];
    }
    set(key: string, value: string) {
        this.cookie[key] = key;
        this.cookie[key] = value;
        return this;
    }
    checkIsKeys (key: string): boolean {
        if( this.cookie[key]) {
            return true;
        }
        else return false;
    }
    hashed(key: string, value: string) {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(value);
        const hashedValue = hash.digest('hex');
        this.cookie[key] = hashedValue;
        return this;
    
    }
    has(key: string): boolean {
        return key in this.cookie;
    }
    dehash(key: string) {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(this.cookie[key]);
        // Note: Hashing is a one-way function, so you cannot retrieve the original value from the hash.
        // This method will return the hashed value, not the original value.
        const hashedValue = hash.digest('hex');
        return hashedValue;
    }
    hash(): Record<string, string> {
        return this.cookie;
    }
    toJson():string{
        return JSON.parse(JSON.stringify(this.cookie));
        
    }
        toStringtoJson(): string {
        return JSON.parse(JSON.stringify(this.cookie));
        }
        
}

export class debounce{
    private timeoutId: NodeJS.Timeout | null = null;
    private delay: number;

    constructor(delay: number = 300) {
        this.delay = delay;
    }

    run(callback: () => void) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            callback();
            this.timeoutId = null;
        }, this.delay);
    }
    clear() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
function checkdebounce(callback: () => void, delay: number = 300) {
    const debounced = new debounce(delay);
    debounced.run(callback);
    return debounced;
}

checkdebounce(() => {
    console.log("Debounced function executed after delay");
}, 5000);
 export class debounce2 {
    private timeoutId: NodeJS.Timeout | null = null;
    private delay: number| null = null;
    constructor() {
        this.delay = null;
        this.timeoutId = null;
    }
    set(data:Promise<void>){
        if(data instanceof Promise) {
            this.timeoutId = setTimeout(() => {
                data.then(() => {
                    console.log("Promise resolved after delay");
                }).catch((error) => {
                    console.error("Promise rejected:", error);
                });
            }, this.delay || 300);

        }
      
    }
}

function checkdebounce2(data: Promise<void>, delay: number = 300) {
    const debounced = new debounce2();
    debounced.set(data);
    return debounced;
}

export { checkdebounce, checkdebounce2 };
export default Cookies;


