import { Model, DataTypes } from "../vendor.ts";

export class User extends Model {
    static table: string = "users";
    static timestamps: boolean = true;

    username!: string;
    password!: string;

    static fields = {
        id: {
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    static sanitize(input: object): object {
        input.id = undefined;
        input.password = undefined;

        return input;
    }
}