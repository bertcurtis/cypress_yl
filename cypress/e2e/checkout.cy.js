const email = "bert.curtis22@gmail.com"
const pw = "Testpassword555"

const product = {
    search_name: 'Immmugummies',
    official_name: 'Immugummies™ supplement',
    retail_price: '$51.32',
    discount_price: '$39.00',
    pv_total: "30.00",
    img_url: '//images.ctfassets.net/x0wnv07j8mtt/54lR8gFTXgq8wOCEeoK2re/6eb9412a44487a5aefce2c5dec934683/44029.jpg?q=75&fm=jpg&w=1080&h=1080'
}

describe('Validate that an order can be checkout', () => {
    beforeEach(() => {
        // 
        cy.visit('https://www.youngliving.com/us/en')

        // Will adjust with viewport size
        //cy.get('[data-testid="qa-locale"]').should('have.text', 'USA / EN')
    })

    it('logs in and makes a selection then navigates to the checkout', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Cypress runner condenses the viewport where the pancake is used instead of the 
        // tradtional sign in, but leaving the code to show both coverages
        cy.get('[data-testid="qa-pancake-menu"]').click()

        cy.get('[data-testid="qa-pancake-menu"]').contains('Sign In').click()
        //cy.get('[data-testid="qa-myaccount"]').contains('Sign In').click()
        cy.get('#loginUsername').type(email)
        cy.get('#loginUsername').should('have.value', email)
        cy.contains('Continue').click()
        // Potentially add more validation on the form control valid email aria input
        // before continuing to password
        cy.get('span').contains(email)
        cy.get('#loginPassword').type(pw)
        cy.get('#login-btn').contains('Sign In').click()
        // The get().contains().click pattern is a way to insulate tests from changes to
        //  button text in the future assuming this should cause a test failure
        // Add a failure test around the timout on pw input


        // Validate login was successful
        cy.get('[data-testid="qa-myaccount"]').contains('My Account')

        // Input search value into field
        cy.get('[data-testid="qa-search-input"]').type(product.search_name)

        // Validates shop page tile as expected values
        // This test will break when prices and products change, need to incorporate dynamic 
        // validation as a way to insulate this from future breakage
        cy.get('[data-testid="qa-product-container"]').first().within(() => {
            cy.get('[data-testid="qa-product-reg-price"]').should('have.text', product.retail_price)
            cy.get('[data-testid="qa-product-name"]').should('have.text', product.official_name)
            cy.get('[data-testid="qa-quick-shop"]').click()
        })


        // Validate Toast container pops up a
        cy.get('[data-testid="qa-toast"]')
            .should('have.text', 'Added to Cart Successfully')
            .get('dismiss')
            .click()

        // Validate all info is correct in checkout side drawer before proceeding
        cy.get('[data-testid="qa-minicart-container"]').within(() => {
            // Using contains instead of should to demonstrate differences in ways of validating state
            cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.pv_total)
            cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.official_name)
            cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.retail_price)

            // Need to add validation here based off of business logic rules
            cy.get('[data-testid="qa-minicart-progressbar"]')
            cy.get('[data-testid="qa-minicart-container"]')
            cy.get('.minicart-button-wrapper').contains('1 item')
        })


        // 
        cy.get('[data-testid="qa-cartcheckout"]').click()

        cy.get('#gtm__modal-btn-close').click()



    })
})
