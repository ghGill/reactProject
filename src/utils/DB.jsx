class DBclass {
    constructor() {
        this.usersTable = []
        this.dbUrl = (process.env.NODE_ENV === 'development')  ? "/" : "https://raw.githubusercontent.com/ghGill/reactProjectDB/refs/heads/main/";
        this.db = {};
        this.usersJson = {};
        this.categoriesJson = {};
        this.colorsJson = {};
        this.tableNextId = {};
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
        // init next id structure
        Object.keys(this.db).forEach( tableName => {
            this.tableNextId[tableName] = this.getTable(tableName).length + 1;
        });

        const users = this.getTable('users');
        for (let u=0; u < users.length; u++) {
            this.usersJson[users[u].id] = users[u];
        }

        const categories = this.getTable('categories');
        for (let c=0; c < categories.length; c++) {
            this.categoriesJson[categories[c].id] = categories[c];
        }

        const colors = this.getTable('colors');
        for (let c=0; c < colors.length; c++) {
            this.colorsJson[colors[c].id] = colors[c];
        }
    }

    getTable(tableName) {
        return this.db[tableName]
    }

    getTableNextId(tableName) {
        const id = this.tableNextId[tableName];
        this.tableNextId[tableName]++;

        return id;
    }

    getUsersJson() {
        return this.usersJson;
    }

    getCategoriesJson() {
        return this.categoriesJson;
    }

    getColorsJson() {
        return this.colorsJson;
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
            'id': this.getTableNextId('users'),
            'image': 'default.jpg',
            'amount': 500,
            'date': '18 Sep 2024'
        };

        this.db.users.push(newUser);

        this.usersJson[this.db.users.length] = newUser;

        return true;
    }

    async getUser(query) {
        return new Promise((resolve, reject) => {
            const result = this.db.users.find(user => Object.entries(query).every(([key, value]) => user[key] === value));

            resolve(result);
        })
    }

    imageUrl(fileName) {
        return `${this.dbUrl}${fileName}`
    }

    addTransaction(data) {
        data.id = this.getTableNextId('transactions');
        this.db.transactions.push(data);
    }

    addPot(data) {
        data.id = this.getTableNextId('pots');
        this.db.pots.push(data);
    }

    updatePot(potData) {
        this.db.pots = this.db.pots.map(pot => {
            if (pot.id === potData.id)
                return potData
            else
                return pot
        });
    }

    deletePot(potId) {
        this.db.pots = this.db.pots.filter(pot => pot.id !== potId);
    }
}

export let DB = new DBclass();
