/* eslint-disable no-undef */
const DBManager = require('../../service/db-manager');

// given
const collection = 'test';

test('DBManager 특정 collection의 doc 삭제', async () => {
    // given
    const doc = 'case';

    try {
        // when
        await DBManager.delete({ collection, doc });

        const snapshot = await DBManager.read({ collection, doc });

        // then
        expect(snapshot.exists).toEqual(false);
    } catch (error) {
        console.log('Error delete doc', error);
    }
});

test('DBManager 수정하려는 doc이 존재하지 않는 경우', async () => {
    // given
    const doc = 'superKingGod';

    // when & then
    expect(() => DBManager.delete({ collection, doc }).toThrow('Is not exist doc'));
});
