export class FlowAttribute {

    private Name: string;
    private Value: string;

    get name(): string {
        return this.Name;
    }

    get value(): string {
        return this.Value;
    }

    constructor(name: string, value: string) {
        this.Name = name;
        this.Value = value;
    }
}
