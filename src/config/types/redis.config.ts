export interface RedisConfig {
  /**
   * Redis connection host
   */
  host: string;
  /**
   *  Redis connection port
   */
  port: string;

  /**
   * Redis TTL
   */
  ttl: string;

  db: number;

  cacheExpiry: number;
}
