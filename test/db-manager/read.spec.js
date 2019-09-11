/* eslint-disable no-undef */
const DBManager = require('../../service/db-manager');

const collection = 'test';

test('DBManager 특정 collection의 모든 doc 불러오기', async () => {
    // given
    const result = [
        {
            number: 1,
        },
    ];

    try {
        // when
        const snapshot = await DBManager.read({ collection });
        const docs = snapshot.docs.map((doc) => doc.data());

        // then
        expect(docs).toEqual(result);
    } catch (error) {
        console.log('Error getting fields', error);
    }
});

test('DBManager 특정조건을 가지는 doc array 불러오기', async () => {
    // given
    const whereClause = { field: 'number', operator: '==', value: 1 };
    const result = [
        {
            number: 1,
        },
    ];

    try {
        // when
        const snapshot = await DBManager.read({ collection }, [whereClause]);
        const docs = snapshot.docs.map((doc) => doc.data());

        // then
        expect(docs).toEqual(result);
    } catch (error) {
        console.log('Error getting docs', error);
    }
});

test('DBManager doc 불러오기', async () => {
    // given
    const doc = 'case';
    const result = {
        number: 1,
    };

    try {
        // when
        const snapshot = await DBManager.read({ collection, doc });

        // then
        expect(snapshot.data()).toEqual(result);
    } catch (error) {
        console.log('Error getting fields', error);
    }
});
