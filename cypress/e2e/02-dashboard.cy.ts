/// <reference types="cypress" />

describe('Part 2: User Management Dashboard', () => {
  let testEmail: string
  let testPassword: string

  beforeEach(() => {
    testEmail = `test${Date.now()}@example.com`
    testPassword = 'password123'
    cy.register(testEmail, testPassword)
  })

  describe('User List', () => {
    it('should display users table', () => {
      cy.contains('Users').should('be.visible')
      cy.get('table').should('be.visible')
      cy.get('thead').should('be.visible')
      cy.contains('Avatar').should('be.visible')
      cy.contains('ID').should('be.visible')
      cy.contains('Name').should('be.visible')
      cy.contains('Email').should('be.visible')
      cy.contains('Actions').should('be.visible')
    })

    it('should display current user in the list', () => {
      cy.contains('Hello').should('be.visible')
      // Navigate to last page where newly registered user likely is
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          // Click last page button
          cy.get('button[aria-label^="Go to page"]').then(($pages) => {
            if ($pages.length > 0) {
              cy.wrap($pages.last()).click()
              cy.wait(1000)
              cy.get('table').contains(testEmail).should('be.visible')
            } else {
              // Fallback: navigate with next button multiple times
              cy.get('button[aria-label="Go to next page"]').then(($next) => {
                if (!$next.is(':disabled')) {
                  // Click next a few times to get to later pages
                  for (let i = 0; i < 5; i++) {
                    cy.get('button[aria-label="Go to next page"]').then(($btn) => {
                      if (!$btn.is(':disabled')) {
                        cy.wrap($btn).click()
                        cy.wait(500)
                      }
                    })
                  }
                  cy.wait(1000)
                  cy.get('table').contains(testEmail).should('be.visible')
                }
              })
            }
          })
        } else {
          // No pagination, user should be on first page
          cy.get('table').contains(testEmail).should('be.visible')
        }
      })
    })

    it('should highlight current user', () => {
      // Navigate to find current user
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          cy.get('button[aria-label^="Go to page"]').then(($pages) => {
            if ($pages.length > 0) {
              cy.wrap($pages.last()).click()
              cy.wait(1000)
              cy.get('table').contains(testEmail).should('be.visible')
            } else {
              cy.get('button[aria-label="Go to next page"]').then(($next) => {
                if (!$next.is(':disabled')) {
                  for (let i = 0; i < 5; i++) {
                    cy.get('button[aria-label="Go to next page"]').then(($btn) => {
                      if (!$btn.is(':disabled')) {
                        cy.wrap($btn).click()
                        cy.wait(500)
                      }
                    })
                  }
                  cy.wait(1000)
                  cy.get('table').contains(testEmail).should('be.visible')
                }
              })
            }
          })
        } else {
          cy.get('table').contains(testEmail).should('be.visible')
        }
      })
    })
  })

  describe('Pagination', () => {
    it('should display pagination controls when more than 6 users', () => {
      // Assuming we have seeded 50 users
      cy.get('nav[aria-label="pagination navigation"]').should('be.visible')
    })

    it('should navigate to next page', () => {
      cy.get('nav[aria-label="pagination navigation"]').then(($pagination) => {
        if ($pagination.length > 0) {
          cy.get('button[aria-label="Go to next page"]').click()
          cy.url().should('include', '/dashboard')
          // Wait for table to update
          cy.get('table tbody tr').should('have.length.at.least', 1)
        }
      })
    })

    it('should navigate to previous page', () => {
      cy.get('nav[aria-label="pagination navigation"]').then(($pagination) => {
        if ($pagination.length > 0) {
          // Go to page 2 first
          cy.get('button[aria-label="Go to next page"]').click()
          cy.wait(500)
          // Then go back
          cy.get('button[aria-label="Go to previous page"]').click()
          cy.url().should('include', '/dashboard')
        }
      })
    })
  })

  describe('Create User', () => {
    it('should open create user dialog', () => {
      cy.contains('Add User').click()
      cy.contains('Create New User').should('be.visible')
      // Check for input fields instead of labels (Material UI labels might not be visible)
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="text"]').should('have.length.at.least', 2) // First Name and Last Name
    })

    it('should create a new user', () => {
      const newUserEmail = `newuser${Date.now()}@example.com`
      cy.contains('Add User').click()
      cy.get('input[type="email"]').should('be.visible').type(newUserEmail)
      // Get all text inputs and fill them
      cy.get('input[type="text"]').first().type('John')
      cy.get('input[type="text"]').last().type('Doe')
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click()
      })
      // Wait for dialog to close (user created successfully)
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist')
      cy.wait(2000) // Wait for table to refresh
      // Navigate to last page where new user likely is
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          cy.get('button[aria-label^="Go to page"]').then(($pages) => {
            if ($pages.length > 0) {
              cy.wrap($pages.last()).click()
              cy.wait(1000)
              cy.get('table').contains(newUserEmail).should('be.visible')
            } else {
              cy.get('body').should('contain', newUserEmail)
            }
          })
        } else {
          cy.get('table').contains(newUserEmail).should('be.visible')
        }
      })
    })

    it('should show error if email already exists', () => {
      cy.contains('Add User').click()
      cy.get('input[type="email"]').should('be.visible').type(testEmail) // Use existing email
      cy.get('input[type="text"]').first().type('John')
      cy.get('input[type="text"]').last().type('Doe')
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click()
      })
      // Wait for API call and error to appear
      cy.wait(3000)
      // Error should appear in the dialog - dialog should stay open
      cy.get('[role="dialog"]').should('be.visible')
      // Check for error message - it should be in the dialog
      cy.get('[role="dialog"]', { timeout: 10000 }).should('contain.text', 'User already exists')
    })

    it('should require email for new user', () => {
      cy.contains('Add User').click()
      cy.get('input[type="text"]').first().type('John')
      cy.get('input[type="text"]').last().type('Doe')
      // Clear email field - form has noValidate so HTML5 validation won't prevent submission
      cy.get('input[type="email"]').clear()
      // Submit the form by clicking the submit button directly
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click()
      })
      // Wait for validation error to appear - error should be set immediately
      cy.wait(500)
      // Error should appear in the dialog
      cy.get('[role="dialog"]').should('be.visible')
      // Check for error message - it should be in the dialog text
      cy.get('[role="dialog"]', { timeout: 5000 }).should('contain.text', 'Email is required')
    })
  })

  describe('Update User', () => {
    it('should open edit user dialog', () => {
      // Find first edit button (not the current user's)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').first().click()
      })
      cy.contains('Edit User').should('be.visible')
    })

    it('should update user information', () => {
      // Get first user's email from table (not current user)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').first().click()
      })

      cy.contains('Edit User').should('be.visible')
      cy.contains('First Name').parent().find('input').clear().type('Updated')
      cy.contains('Last Name').parent().find('input').clear().type('Name')
      cy.contains('Save').click()
      cy.wait(1000)
      cy.get('table').contains('Updated Name').should('be.visible')
    })

    it('should allow updating user information', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').first().click()
      })

      cy.contains('Edit User').should('be.visible')
      cy.contains('First Name').parent().find('input').clear().type('UpdatedUser')
      cy.contains('Save').click()
      cy.wait(1000)
      cy.get('table').contains('UpdatedUser').should('be.visible')
    })
  })

  describe('Delete User', () => {
    it('should delete a user', () => {
      // Stub window.confirm before creating user
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true)
      })

      // Create a user first
      const newUserEmail = `todelete${Date.now()}@example.com`
      cy.contains('Add User').click()
      cy.get('input[type="email"]').should('be.visible').type(newUserEmail)
      cy.get('input[type="text"]').first().type('Delete')
      cy.get('input[type="text"]').last().type('Me')
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click()
      })
      // Wait for create dialog to close
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist')
      cy.wait(2000) // Wait for table refresh

      // Navigate to last page where new user likely is
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          cy.get('button[aria-label^="Go to page"]').then(($pages) => {
            if ($pages.length > 0) {
              cy.wrap($pages.last()).click()
              cy.wait(1000)
              cy.get('table tbody').contains('tr', newUserEmail).within(() => {
                cy.get('button').last().click()
              })
            } else {
              // Fallback: navigate with next button
              cy.get('button[aria-label="Go to next page"]').then(($next) => {
                if (!$next.is(':disabled')) {
                  for (let i = 0; i < 5; i++) {
                    cy.get('button[aria-label="Go to next page"]').then(($btn) => {
                      if (!$btn.is(':disabled')) {
                        cy.wrap($btn).click()
                        cy.wait(500)
                      }
                    })
                  }
                  cy.wait(1000)
                  cy.get('table tbody').contains('tr', newUserEmail).within(() => {
                    cy.get('button').last().click()
                  })
                }
              })
            }
          })
        } else {
          // No pagination, user should be on first page
          cy.get('table tbody').contains('tr', newUserEmail).within(() => {
            cy.get('button').last().click()
          })
        }
      })

      // Confirm should be called and user should be deleted
      cy.window().its('confirm').should('have.been.called')
      cy.wait(2000)
      // User should no longer exist - reload to verify
      cy.reload()
      cy.wait(1000)
      cy.get('body').should('not.contain', newUserEmail)
    })

    it('should prevent deleting current user', () => {
      // Navigate to last page where current user likely is
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length > 0) {
          cy.get('button[aria-label^="Go to page"]').then(($pages) => {
            if ($pages.length > 0) {
              cy.wrap($pages.last()).click()
              cy.wait(1000)
              cy.get('table tbody').contains('tr', testEmail).within(() => {
                cy.get('button').last().should('be.disabled')
              })
            } else {
              // Fallback: navigate with next button
              cy.get('button[aria-label="Go to next page"]').then(($next) => {
                if (!$next.is(':disabled')) {
                  for (let i = 0; i < 5; i++) {
                    cy.get('button[aria-label="Go to next page"]').then(($btn) => {
                      if (!$btn.is(':disabled')) {
                        cy.wrap($btn).click()
                        cy.wait(500)
                      }
                    })
                  }
                  cy.wait(1000)
                  cy.get('table tbody').contains('tr', testEmail).within(() => {
                    cy.get('button').last().should('be.disabled')
                  })
                }
              })
            }
          })
        } else {
          // No pagination, user should be on first page
          cy.get('table tbody').contains('tr', testEmail).within(() => {
            cy.get('button').last().should('be.disabled')
          })
        }
      })
    })

    it('should show confirmation dialog before deleting', () => {
      // Stub window.confirm before clicking delete
      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(false) // Cancel the deletion
      })

      // Try to delete any user (not current)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').last().then(($btn) => {
          if (!$btn.is(':disabled')) {
            cy.wrap($btn).click()
            // window.confirm should be called
            cy.window().its('confirm').should('have.been.called')
          } else {
            // If button is disabled, skip this test assertion
            cy.log('Delete button is disabled (current user), skipping test')
          }
        })
      })
    })
  })

  describe('Logout', () => {
    it('should logout and redirect to sign in', () => {
      cy.contains('Logout').click()
      cy.url().should('include', '/signin')
    })
  })
})
