import { KeyValueRepository } from './key-value-repository';

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

export class TokensRepository {
  public static addAccessToken(token: string): void {
    KeyValueRepository.setItem(ACCESS_TOKEN, JSON.stringify(token));
  }

  public static getAccessToken(): string | null {
    return KeyValueRepository.getItem<string>(ACCESS_TOKEN);
  }

  public static addRefreshToken(token: string): void {
    KeyValueRepository.setItem(REFRESH_TOKEN, JSON.stringify(token));
  }

  public static getRefreshToken(): string | null {
    return KeyValueRepository.getItem<string>(REFRESH_TOKEN);
  }
}
