import { UnauthorizedException } from '@nestjs/common';
import otpGenerator from 'otp-generator';
import { BasePaginatedResponseDto } from './base/dto';

export const replacer = (i: number, arr: any, str: string) => {
  const len = arr.length;
  if (i < len) {
    const [key, value] = arr[i];
    const formattedKey = `{{${key}}}`;
    return replacer(i + 1, arr, str.split(formattedKey).join(value));
  } else {
    return str;
  }
};

export const generateOtp = () =>
  otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

export const extractTokenFromReq = (req: Request, error: string) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) throw new UnauthorizedException(error);
  const token = authorizationHeader.split(' ')[1];
  if (!token) throw new UnauthorizedException(error);
  return token;
};

export const buildResponseDataWithPagination = <T>(
  data: T[] | any,
  total: number,
  pagination: { limit: number; page: number },
): BasePaginatedResponseDto<T> => {
  return {
    data,
    pagination: {
      limit: Number(pagination.limit),
      page: Number(pagination.page),
      total,
      size: data.length,
      pages:
        Number(Math.ceil(total / pagination.limit).toFixed()) ||
        (total && 1) ||
        0,
    },
  };
};

export const camelCaseKeysToUnderscore = (obj: object) => {
  if (typeof obj != 'object') return obj;
  for (const oldName in obj) {
    const newName = oldName.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`);
    if (newName != oldName) {
      if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
      }
    }
    if (typeof obj[newName] == 'object') {
      obj[newName] = camelCaseKeysToUnderscore(obj[newName]);
    }
  }
  return obj;
};

export const underscoreKeysToCamelCase = (obj: object) => {
  if (typeof obj != 'object') return obj;
  for (const oldName in obj) {
    const newName = oldName.replace(
      /_([a-z])/g,
      (_, p1) => `${p1.toUpperCase()}`,
    );
    if (newName != oldName) {
      if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
      }
    }
    if (typeof obj[newName] == 'object') {
      obj[newName] = underscoreKeysToCamelCase(obj[newName]);
    }
  }
  return obj;
};
