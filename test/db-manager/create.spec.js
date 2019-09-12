/* eslint-disable no-undef */
const DBManager = require('../../service/db-manager');

// given
const collection = 'test';

test('DBManager 특정 collection에 doc 추가 - ID지정', async () => {
    // given
    const randomNumber = Math.random() * 1000;
    const doc = `case1${randomNumber}`;
    const data = { number: randomNumber };

    try {
        // when
        await DBManager.create({ collection, doc, data });

        const snapshot = await DBManager.read({ collection, doc });

        // then
        expect(snapshot.data()).toEqual(data);
    } catch (error) {
        console.log('Error create doc', error);
    }
});

test('DBManager 특정 collection에 doc 추가 - ID 미지정', async () => {
    // given
    const randomNumber = Math.random() * 1000;
    const data = { number: randomNumber };
    const whereClause = { field: 'number', operator: '==', value: randomNumber };

    try {
        // when
        await DBManager.create({ collection, data });

        const snapshot = await DBManager.read({ collection }, [whereClause]);
        const docs = snapshot.docs.map((doc) => doc.data());

        // then
        expect(docs[0]).toEqual(data);
    } catch (error) {
        console.log('Error create doc', error);
    }
});
