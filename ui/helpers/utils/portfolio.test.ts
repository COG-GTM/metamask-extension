import { getPortfolioUrl } from './portfolio';

const ANALYTICS_ID = '0xpersistentAnalyticsId';

describe('getPortfolioUrl', () => {
  const originalPortfolioUrl = process.env.PORTFOLIO_URL;

  beforeEach(() => {
    process.env.PORTFOLIO_URL = 'https://portfolio.test';
  });

  afterEach(() => {
    process.env.PORTFOLIO_URL = originalPortfolioUrl;
  });

  it('includes the analytics id when metrics are enabled', () => {
    const url = new URL(
      getPortfolioUrl(
        'explore/tokens',
        'ext_portfolio_button',
        ANALYTICS_ID,
        true,
        true,
      ),
    );

    expect(url.origin).toBe('https://portfolio.test');
    expect(url.pathname).toBe('/explore/tokens');
    expect(url.searchParams.get('metamaskEntry')).toBe('ext_portfolio_button');
    expect(url.searchParams.get('metametricsId')).toBe(ANALYTICS_ID);
    expect(url.searchParams.get('metricsEnabled')).toBe('true');
    expect(url.searchParams.get('marketingEnabled')).toBe('true');
  });

  it.each([
    ['metrics are disabled', false],
    ['the consent decision is unknown', undefined],
  ])('omits the analytics id when %s', (_, metricsEnabled) => {
    const url = new URL(
      getPortfolioUrl(
        'explore/tokens',
        'ext_batch_sell_empty',
        ANALYTICS_ID,
        metricsEnabled,
        false,
      ),
    );

    expect(url.searchParams.has('metametricsId')).toBe(false);
    expect(url.href).not.toContain(ANALYTICS_ID);
    expect(url.searchParams.get('metamaskEntry')).toBe('ext_batch_sell_empty');
    expect(url.searchParams.get('metricsEnabled')).toBe('false');
    expect(url.searchParams.get('marketingEnabled')).toBe('false');
  });

  it('omits the analytics id when it is empty', () => {
    const url = new URL(getPortfolioUrl('stake', 'ext_stake_button', '', true));

    expect(url.searchParams.has('metametricsId')).toBe(false);
    expect(url.searchParams.get('metricsEnabled')).toBe('true');
  });

  it('appends the account address and tab when provided', () => {
    const url = new URL(
      getPortfolioUrl(
        'transfer',
        'ext_funding_method_modal',
        ANALYTICS_ID,
        false,
        false,
        '0xabc',
        'transfer',
      ),
    );

    expect(url.searchParams.get('accountAddress')).toBe('0xabc');
    expect(url.searchParams.get('tab')).toBe('transfer');
    expect(url.searchParams.has('metametricsId')).toBe(false);
  });
});
