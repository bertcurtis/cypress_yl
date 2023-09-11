const login_id = "4586530"
const pw = "Testpassword555"

const product = {
    search_name: 'Immugummies',
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
        if (cy.get('[data-testid="qa-toast"]').should('be.visible')) {
            cy.get('[data-testid="qa-toast"]')
            .contains('dismiss')
            .click()
        }


        // Cypress runner condenses the viewport where the pancake is used instead of the 
        // tradtional sign in, but leaving the code to show both coverages
        //cy.get('[data-testid="qa-pancake-menu"]').first().click()
        //cy.get('[data-testid="qa-pancake-menu"]').first().should('have.class', 'close-icon')
        //cy.get('li').contains('Sign In').should('be.visible').click()
        cy.get('[data-testid="qa-myaccount"]').contains('Sign In').click()

        // Input login info into fields
        cy.get('#loginUsername').type(login_id)
        cy.get('#loginUsername').should('have.value', login_id)
        cy.contains('Continue').click()
        // Potentially add more validation on the form control valid email aria input
        // before continuing to password
        cy.get('span').contains(login_id)
        cy.get('#loginPassword').type(pw)
        cy.get('#login-btn').contains('Sign In').should('be.enabled')
        cy.get('form').submit()
        // Add a failure test around the timout on pw input


        // Validate login was successful, only works with properly adjusted viewport
        cy.get('[data-testid="qa-myaccount"]').should('be.visible')

        // Input search value into field
        cy.get('[data-testid="qa-search-input"]').type(product.search_name)

        // Validates shop page tile as expected values
        // This test will break when prices and products change, need to incorporate dynamic 
        // validation as a way to insulate this from future breakage
        cy.get('[data-testid="qa-product-container"]').first().within(() => {
            cy.get('[data-testid="qa-product-reg-price"]').should('have.text', 'Retail: ' + product.retail_price)
            cy.get('[data-testid="qa-product-name"]').should('have.text', product.official_name)
            cy.get('[data-testid="qa-quick-shop"]').first().scrollIntoView().click()
        })


        // Validate Toast container pops up, need to improve the validation on the message
        cy.get('[data-testid="qa-toast"]')
            .should('have.text', 'Added to Cart Successfullydismiss')
            .contains('dismiss')
            .click()

        // Validate all info is correct in checkout side drawer before proceeding
        cy.get('[data-testid="qa-minicart-container"]').should('be.visible')
        // Using contains instead of should to demonstrate differences in ways of validating state
        cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.pv_total)
        cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.official_name)
        cy.get('[data-testid="qa-grouped-products-wrapper"]').contains(product.retail_price)

        // Need to add validation here based off of business logic rules, for now verifying visibility
        cy.get('[data-testid="qa-minicart-progressbar"]').should('be.visible')
        cy.get('[data-testid="qa-minicart-container"]').should('be.visible')
        cy.get('.minicart-button-wrapper').contains('item')

        cy.get('[data-testid="qa-cartcheckout"]').click()

        cy.get('#gtm__modal-btn-close').click()


        cy.get('[data-testid="qa-estimated-total-value"]').contains(product.retail_price)
        cy.get('[data-testid="qa-cart-checkout"]').contains("Checkout").click()
        cy.get('[data-testid="qa-referral-code-continue"]').click()
        cy.get('[data-testid="qa-confirm-yes"]').click()
        // Could not continue past this point, the modal would not close after clicking
        // I would submit a bug at this point and continue once the issue was resolved



    })
})
