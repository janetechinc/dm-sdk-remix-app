import {nanoid} from "nanoid";

const jdidKey = 'jdid'

interface Config {
    apiKey: string;
    env: string
}

export class FakeSdk {
    private config: Config
    private jdid: string;

    constructor(config: Config, request?: Request) {
        const isSsr = typeof window === 'undefined'
        console.log(typeof window)

        let jdid: string;
        if (isSsr) {
            if (!request) {
                throw new Error('When the SDK is used in an SSR context, a HTTP request must be included for initialization')
            }
            jdid = this.readJdidCookie(request) ?? this.generateJdid()
        } else  {
            if (request) {
                throw new Error("Don't include a HTTP request for CSR usage")
            }
            jdid = this.getLocalStorageJdid()
        }

        this.jdid = jdid;
        this.config = config
    }

    makeJdidCookie(): string {
        return `${jdidKey}=${this.jdid};`
    }

    fetchAd(type: string): Ad {
        const flight = nanoid()
        return new Ad({type, flight})
    }

    private getLocalStorageJdid() {
        let jdid = this.readLocalStorage()
        if (!jdid) {
            jdid = this.generateJdid()
            this.setLocalStorage(jdid)
        }
        return jdid
    }

    private readLocalStorage() {
        return localStorage.getItem(jdidKey)
    }

    private setLocalStorage(jdid: string) {
        localStorage.setItem(jdidKey, jdid)
    }

    private readJdidCookie(request: Request): string | undefined {
        const cookieHeader = request.headers.get('cookie')
        let jdid: string | undefined = undefined;
        if (cookieHeader) {
            cookieHeader.split(';').find((cookie) => {
                const parts = cookie.split('=')
                if (parts[0] === jdidKey) {
                    jdid = parts[1]
                    console.log('sdk:'+jdid)
                }
            })
        }
        return jdid
    }

    private generateJdid() {
        return nanoid()
    }

}

interface AdProps {
    type: string;
    flight: string;
}

export class Ad {
    readonly type: string;
    readonly flight: string;

    constructor({type, flight}: AdProps) {
        this.type = type;
        this.flight = flight;
    }

    serialize(): AdProps {
        return {
            type: this.type,
            flight: this.flight,
        }
    }

    click(productId: number) {
        console.log('tracking click')
        this.logData(productId)
    }

    impress(productId: number) {
        console.log('tracking impression')
        this.logData(productId)
    }

    private logData (productId: number) {
        console.log({productId, type: this.type, flight: this.flight})
    }


}
