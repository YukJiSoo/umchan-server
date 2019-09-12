const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

class DBManager {
    constructor() {
        this.db = admin.firestore();
    }

    read({ collection, doc }, whereClause) {
        let query = this.db.collection(collection);
        if (doc) query = query.doc(doc);
        else if (whereClause) {
            whereClause.forEach((clause) => {
                query = query.where(clause.field, clause.operator, clause.value);
            });
        }

        return query.get();
    }

    async create({ collection, doc, data }) {
        // check doc exist
        try {
            if (doc) {
                const snapshot = await this.read({ collection, doc });
                if (snapshot.exists) throw new Error('Is already exist doc');
            }
        } catch (error) {
            return new Promise((reject) => reject(error.message));
        }

        let query = this.db.collection(collection);
        query = doc ? query.doc(doc) : query.doc();

        return query.set(data);
    }

    async update({ collection, doc, data }) {
        // check doc exist
        try {
            if (doc) {
                const snapshot = await this.read({ collection, doc });
                if (!snapshot.exists) throw new Error('Is not exist doc');
            }
        } catch (error) {
            return new Promise((reject) => reject(error.message));
        }

        let query = this.db.collection(collection);
        query = doc ? query.doc(doc) : query.doc();

        return query.update(data);
    }

    async delete({ collection, doc }) {
        // check doc exist
        try {
            if (doc) {
                const snapshot = await this.read({ collection, doc });
                if (!snapshot.exists) throw new Error('Is not exist doc');
            }
        } catch (error) {
            return new Promise((reject) => reject(error.message));
        }

        const query = this.db.collection(collection).doc(doc);

        return query.delete();
    }
}
module.exports = new DBManager();
