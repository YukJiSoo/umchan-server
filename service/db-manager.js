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
}
module.exports = new DBManager();
