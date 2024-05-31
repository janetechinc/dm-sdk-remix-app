import {nanoid} from "nanoid";

interface Config {
    apiKey: string;
    env: string
}

export class FakeSdk {
    private config: Config

    constructor(config: Config) {
        this.config = config
    }

    fetchAd(type: string): Ad {
        const flight = nanoid()
        return new Ad({type, flight})
    }
}

// let _fakeSdk: FakeSdk | null = null;
// export const initializeSdk = (config: Config) => {
//     _fakeSdk = new FakeSdk(config)
// }

interface AdProps {
    type: string;
    flight: string;
}

export class Ad {
    // passed in to fetchAd call
    readonly type: string;

    // returned from fetchAd request
    readonly flight: string;

    constructor({type, flight}: AdProps) {
        this.type = type;
        this.flight = flight;
    }

    click(productId: number) {
        console.log('tracking click')
        this.logData(productId)
    }

    impress(productId: number) {
        this.logData(productId)
    }

    private logData (productId: number) {
        console.log({productId, type: this.type, flight: this.flight})
    }

    serialize(): AdProps {
        return {
            type: this.type,
            flight: this.flight
        }
    }

    static deserialize(adProps: AdProps) {
        return new Ad(adProps)
    }

}

// COOKIES:
//  jdid
//  storeId