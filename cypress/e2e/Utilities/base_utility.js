export function launchVerify() {
    cy.visit('https://coinmarketcap.com/');
    cy.get('[data-role="logo"]').should('be.visible');
    cy.get('.grid').should('be.visible');
}

export function openSearch() {
    cy.get('.Search_mobile-icon-wrapper__95svj').should('be.visible').click();
    cy.get('input[placeholder="What are you looking for?"]').should('be.visible');
}