/* eslint-disable no-undef */
const jwt = require('../util/jwt-manager');

test('jwt-manager token 생성 success', async () => {
    // given
    const payload = {
        emamil: 'test213@test.com',
    };

    try {
        // when
        const token = await jwt.tokenCreator(payload);

        console.log(token);
        // then
        expect(token).not.toBe(undefined);
    } catch (error) {
        // then
        console.log(error);
    }
});
