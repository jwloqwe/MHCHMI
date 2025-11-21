import { launchVerify, openSearch } from "./Utilities/base_utility";

describe('Search and Filter Features', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/lite*').as('currencyPageLoad');
  })

  const getCryptoSearch = (params) => ({
    pathname: '**/search*',
    query: params,
    method: 'GET',
  });
  
  // Due to the TnS policy, this test is skipped but the code should be able to work if it is allowed on the website. https://coinmarketcap.com/terms/ @ 5.1.4
  it.skip('Verify Search Feature Using Full Name', () => {
    // Start up the application
    launchVerify();
    // Open up the Search Modal
    openSearch();
    cy.get('input[placeholder="What are you looking for?"]').type('Bitcoin');
    // This ensures that the search API is called with the correct query parameter
    const searchedValue = { q: 'Bitcoin' };
    cy.intercept(getCryptoSearch(searchedValue)).as('getSearchedCypto');
    cy.wait('@getSearchedCypto');
    // Access the Bitcoin Page by clicking from the search result after Assertion using contains(starts with)
    cy.contains('[class^="SearchCryptoRow_container"]', 'Bitcoin').click({ force: true });
    // Verify that we are on the Bitcoin Page
    cy.url().should('eq', 'https://coinmarketcap.com/currencies/bitcoin/');
    cy.wait('@currencyPageLoad');
    cy.contains('[data-role="coin-name"]', 'Bitcoin', { timeout: 10000 });
  });

  it('Verify the search results', () => {
    launchVerify();
    openSearch();
    cy.get('input[placeholder="What are you looking for?"]').type('Bitcoin');
    const searchedValue = { q: 'Bitcoin' };
    cy.intercept(getCryptoSearch(searchedValue)).as('getSearchedCypto');
    cy.wait('@getSearchedCypto');
    cy.contains('[class^="SearchCryptoRow_container"]', 'Bitcoin')
  });

  it('Verify Basic Display of Data on UI', () => {
    // Start up the application
    launchVerify();
    // Tried to Click on the Name to sort but it did not work as expected Will just leave it here.
    // cy.contains('[class*="sortable-header-container"]', 'Name').click({force: true});
    // Verify the first 15 Cryptocurrencies are visible before the others load.
    cy.get('[class$=coin-item]').should('be.visible').and('have.length', 15);    
    // Verify that the first 3 sortable Header is visible: Name, Price, 1h %
    cy.contains('[class$=sortable-header-container]','Name').should('be.visible');
    cy.contains('[class$=sortable-header-container]', 'Price').should('be.visible');
    cy.contains('[class$=sortable-header-container]', '1h %').should('be.visible');
    // Verify that hte first Cryptocurrency is Bitcoin (BTC)
    cy.get('[class$="coin-item"]').first().within(() => {
      cy.get('p').should('contain.text', 'Bitcoin');});
  });
});  