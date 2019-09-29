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
            return new Promise((_, reject) => reject(error.message));
        }

        let query = this.db.collection(collection);
        query = doc ? query.doc(doc) : query.doc();

        return query.set(data, { merge: true });
    }

    async update({ collection, doc, data }) {
        // check doc exist
        try {
            if (doc) {
                const snapshot = await this.read({ collection, doc });
                if (!snapshot.exists) throw new Error('Is not exist doc');
            }
        } catch (error) {
            return new Promise((_, reject) => reject(error.message));
        }

        let query = this.db.collection(collection);
        query = doc ? query.doc(doc) : query.doc();

        return query.update(data);
    }

    async updateArrayField({ collection, doc, key, value }) {
        // check doc exist
        try {
            if (doc) {
                const snapshot = await this.read({ collection, doc });
                if (!snapshot.exists) throw new Error('Is not exist doc');
            }
        } catch (error) {
            return new Promise((_, reject) => reject(error.message));
        }

        if (doc === undefined) return new Promise((_, reject) => reject("doc id undefined"));

        const query = this.db.collection(collection).doc(doc);
        const data = {};
        data[`${key}`] = admin.firestore.FieldValue.arrayUnion(value);
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
            return new Promise((_, reject) => reject(error.message));
        }

        const query = this.db.collection(collection).doc(doc);

        return query.delete();
    }

    async batch(...jobs) {
        const batch = this.db.batch();

        jobs.forEach((job) => {
            let query = this.db.collection(job.collection);
            query = job.doc ? query.doc(job.doc) : query.doc();

            switch (job.method) {
            case 'create':
                batch.set(query, job.data, { merge: true });
                break;
            case 'update':
                batch.update(query, job.data);
                break;
            case 'updateArrayField': {
                const data = {};
                data[`${job.key}`] = admin.firestore.FieldValue.arrayUnion(job.value);

                batch.update(query, data);
                break;
            }
            case 'delete':
                batch.delete(query);
                break;
            default:
                console.log('err: uncorrect method');
                break;
            }
        });

        return batch.commit().catch((error) => { throw error; });
    }
}

module.exports = new DBManager();
