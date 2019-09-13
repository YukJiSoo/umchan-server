function define(name, value) {
    Object.defineProperty(exports, name, {
        value,
        enumerable: true,
    });
}

define('ERROR', {
    EMAIL_FORMAT: {
        CODE: 403,
        MESSAGE: '잘못된 email 형식입니다',
    },
    EMAIL_DUPLICATION: {
        CODE: 409,
        MESSAGE: '중복된 email입니다',
    },
    PASSWORD_LENGTH: {
        CODE: 403,
        MESSAGE: '8자 이상 16자 이하로 입력해주세요',
    },
    PASSWORD_ALPHA: {
        CODE: 403,
        MESSAGE: '영문을 최소 1자이상 포함해주세요',
    },
    PASSWORD_NUMBER: {
        CODE: 403,
        MESSAGE: '숫자를 최소 1자 이상 포함해주세요',
    },
    PASSWORD_SPECIAL_CHAR: {
        CODE: 403,
        MESSAGE: '특수문자를 최소 1자 이상 포함해주세요',
    },
    NAME_FORMAT: {
        CODE: 403,
        MESSAGE: '잘못된 이름 형식입니다',
    },
    NICKNAME_FORMAT: {
        CODE: 403,
        MESSAGE: '잘못된 별명 형식입니다',
    },
    NICKNAME_DUPLICATION: {
        CODE: 409,
        MESSAGE: '중복된 별명입니다',
    },
    LOCATION_NOT_NUMBER: {
        CODE: 403,
        MESSAGE: '위치 값이 잘못됬습니다',
    },
    ACCOUNT_NO_MATCH_EMAIL: {
        CODE: 403,
        MESSAGE: '존재하지 않는 email입니다',
    },
    ACCOUNT_NO_MATCH_PASSWORD: {
        CODE: 403,
        MESSAGE: '비밀번호가 일치하지 않습니다',
    },
});
