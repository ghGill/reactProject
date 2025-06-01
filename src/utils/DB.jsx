class DBclass {
    constructor() {
        this.usersTable = []
        this.dbUrl = "https://raw.githubusercontent.com/ghGill/reactProjectDB/refs/heads/main/";
    }
    
    async connect() {
        await this.readTable('users.json');
    }

    async readTable(tableName) {
        await fetch(`${this.dbUrl}${tableName}`)
            .then(async res => {
                const data = await res.json();
                this.setUsers(data);

                return true;
            })
            .catch(e => {
                this.setUsers([]);

                return true
            })
    }

    setUsers(users) {
        this.usersTable = users;
    }

    async emailExist(email) {
        return new Promise((resolve, reject) => {
            const result = this.usersTable.find(user => (user.email === email));

            resolve(result !== undefined);
        })
    }

    async addUsere(user) {
        if (await this.emailExist(user.email))
            return 'This email is already registered.';

        let newUser = {
            ...user,
            'id': this.usersTable.length + 1,
            'image': 'default.png',
            'amount': -259.50,
            'date': '18 Sep 2024'
        };

        this.usersTable.push(newUser);

        return true;
    }

    async getUser(email, password) {
        return new Promise((resolve, reject) => {
            const result = this.usersTable.find(user => ((user.email === email) && (user.password === password)));

            resolve(result);
        })
    }

    imageUrl(fileName) {
        return `${this.dbUrl}${fileName}`
    }
}

export let DB = new DBclass();
