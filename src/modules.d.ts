interface IWebsite {
    captureInterval: number | string;
    height: number | string;
    width: number | string;
    name: string;
    url: string;
}

declare module '*/config.json' {
    const uniqueFiles: boolean;
    const websites: IWebsite[];
}
