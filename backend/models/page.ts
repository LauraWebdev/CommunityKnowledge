import { Model, DataTypes } from "../vendor.ts";

export class Page extends Model {
    static table: string = "pages";
    static timestamps: boolean = true;

    slug!: string;
    title!: string;
    content!: string;

    static fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    };

    static defaults = {
        content: '{}',
    };

    static sanitize(input: object): object {
        input.id = undefined;
        input.content = JSON.parse(input.content);

        return input;
    }
}