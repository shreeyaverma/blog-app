import config from "../config/config";
import { Client, Account, ID } from "appwrite";

//auth is for authenticating user
export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteURL)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)

            if (userAccount) {
                //call another method 
                return this.login({ email, password })
            }
            else {
                return userAccount
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            throw error;
        }
    }

    // async getCurrentUser() {
    //     try {
    //         return await this.account.get()
    //     } catch (error) {
    //         console.log("Appwrite service :: getCurrentUser() :: ", error);
    //     }
    //     return null
    // }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            if (!user) {
                const guest = await this.account.createAnonymousSession();
                return guest
            }
            return user;
        }
        catch (error) {
            // throw error;
            console.log("Appwrite serive :: getCurrentUser:: error: ->>", error);
        }
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service:: logout:: error", error)
        }
    }
}

const authService = new AuthService()

export default authService


