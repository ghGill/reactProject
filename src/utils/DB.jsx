class DBclass {
    constructor() {
        this.usersTable = []
        this.dbUrl = (process.env.NODE_ENV === 'development')  ? "/" : "https://raw.githubusercontent.com/ghGill/reactProjectDB/refs/heads/main/";
        this.db = {};
        this.usersJson = {};
        this.categoriesJson = {};
    }
    
    async connect(jsonFileName) {
        await fetch(`${this.dbUrl}db.json`)
            .then(async res => {
                const data = await res.json();
                
                this.db = data;

                this.setTablesToJson();
                
                return true;
            })
            .catch(e => {
                return false
            })
    }

    setTablesToJson() {
        const users = this.getTable('users');
        
        for (let u=0; u < users.length; u++) {
            this.usersJson[users[u].id] = users[u];
        }

        const categories = this.getTable('categories');
        
        for (let c=0; c < categories.length; c++) {
            this.categoriesJson[categories[c].id] = categories[c];
        }
    }

    getUsersJson() {
        return this.usersJson;
    }

    getCategoriesJson() {
        return this.categoriesJson;
    }

    async emailExist(email) {
        return new Promise((resolve, reject) => {
            const result = this.db.users.find(user => (user.email === email));

            resolve(result !== undefined);
        })
    }

    async addUsere(user) {
        if (await this.emailExist(user.email))
            return 'This email is already registered.';

        let newUser = {
            ...user,
            'id': this.usersTable.length + 1,
            'image': 'default.jpg',
            'amount': -259.50,
            'date': '18 Sep 2024'
        };

        this.db.users.push(newUser);

        return true;
    }

    async getUser(email, password) {
        return new Promise((resolve, reject) => {
            const result = this.db.users.find(user => ((user.email === email) && (user.password === password)));

            resolve(result);
        })
    }

    imageUrl(fileName) {
        return `${this.dbUrl}${fileName}`
    }

    getTable(tableName) {
        return this.db[tableName]
    }

    addTransaction(data) {
        data.id = this.db.transactions.length + 1;
        this.db.transactions.push(data);
    }
}

export let DB = new DBclass();
