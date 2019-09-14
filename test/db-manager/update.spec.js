/* eslint-disable no-undef */
const DBManager = require('../../service/db-manager');

// given
const collection = 'test';

test('DBManager 특정 collection의 doc의 field값 수정', async () => {
    // given
    const doc = 'case';
    const data = { number: 2 };

    try {
        // when
        await DBManager.update({ collection, doc, data });

        const snapshot = await DBManager.read({ collection, doc });

        // then
        expect(snapshot.data()).toEqual(data);
    } catch (error) {
        console.log('Error update doc', error);
    }
});

test('DBManager 수정하려는 doc이 존재하지 않는 경우', async () => {
    // given
    const doc = 'superKingGod';
    const data = { number: 1 };

    expect(() => DBManager.update({ collection, doc, data }).toThrow('Is not exist doc'));
});


test('DBManager array field에 추가', async () => {
    // given
    const doc = 'case';
    const key = 'array';
    const value = 'array test';

    const data = { number: 2, ttt: '123', array: ['123', '456', 'array test'] };

    try {
        // when
        await DBManager.updateArrayField({ collection, doc, key, value });

        const snapshot = await DBManager.read({ collection, doc });

        // then
        expect(snapshot.data()).toEqual(data);
    } catch (error) {
        console.log('Error update array doc', error);
    }
});
