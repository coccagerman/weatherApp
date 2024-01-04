describe('Weather App Integration Tests', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('allows the user to search for a city', () => {
        cy.get('input[role="combobox"]').type('New York').wait(1000)

        cy.get('.MuiAutocomplete-option').should('be.visible').and('have.length.at.least', 1)
    })

    it('displays weather information after selecting a city', () => {
        cy.get('input[role="combobox"]').type('New York').wait(1000)

        cy.get('.MuiAutocomplete-option').first().click()

        cy.get('h2').contains('Weather Details', { timeout: 3000 }).should('be.visible')
        cy.get('span').contains('Temperature:').should('be.visible')
        cy.get('span').contains('Condition:').should('be.visible')
        cy.get('span').contains('Humidity:').should('be.visible')
    })

    it('handles city errors gracefully', () => {
        cy.intercept('GET', 'https://nominatim.openstreetmap.org/search*', {
            forceNetworkError: true
        }).as('getCityData')

        // Trigger the fetchCities function, e.g., by typing into the city input field
        cy.get('input[role="combobox"]').type('New York')

        // Assert that the error message is displayed
        cy.get('.MuiAlert-message').should('contain', 'An error occurred, please try again later.')
    })

    it('handles weather errors gracefully', () => {
        cy.intercept('GET', 'http://api.openweathermap.org/data/2.5/weather*', { forceNetworkError: true }).as(
            'getWeatherData'
        )

        cy.get('input[role="combobox"]').type('New York').wait(1000)

        cy.get('.MuiAutocomplete-option').first().click()

        // Check for error message
        cy.get('.MuiAlert-message').should('contain', 'An error occurred, please try again later.')
    })
})
